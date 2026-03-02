import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useLanguage } from "@/i18n/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";

const Login = () => {
  const navigate = useNavigate();
  const [connectionError, setConnectionError] = useState(false);
  const [isConnectionDialogOpen, setIsConnectionDialogOpen] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const testConnection = async () => {
      try {
        const { error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });
        if (error) {
          console.error("Supabase connection error:", error);
          setConnectionError(true);
          setIsConnectionDialogOpen(true);
        } else {
          setConnectionError(false);
          checkUser();
        }
      } catch (err) {
        console.error("Failed to connect to Supabase:", err);
        setConnectionError(true);
        setIsConnectionDialogOpen(true);
      }
    };

    testConnection();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, session);
        
        if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
          if (session) {
            try {
              const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();

              if (profileError) {
                console.error("Error checking profile:", profileError);
                toast.error(t("signInError"));
                return;
              }

              if (!profile) {
                console.log("Profile not found, creating...");
                const { error: insertError } = await supabase
                  .from('profiles')
                  .insert([{ id: session.user.id, username: session.user.email }]);

                if (insertError) {
                  console.error("Error creating profile:", insertError);
                  toast.error(t("signUpError"));
                  return;
                }
              }

              toast.success(t("signInSuccess"));
              navigate("/");
            } catch (error) {
              console.error("Error during sign in process:", error);
              toast.error(t("connectionErrorRetry"));
            }
          }
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/");
      }
    } catch (error) {
      console.error("Error checking session:", error);
    }
  };

  const retryConnection = () => {
    setIsConnectionDialogOpen(false);
    window.location.reload();
  };

  return (
    <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="absolute top-4 end-4">
        <LanguageToggle />
      </div>
      <div className="max-w-md w-full space-y-8 glass-card p-8 rounded-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            {t("loginTitle")}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-300">
            {t("loginSubtitle")}
          </p>
        </div>
        
        {connectionError ? (
          <div className="text-center space-y-4">
            <div className="text-red-400 p-4 rounded-md bg-red-900/20 border border-red-800">
              {t("connectionError")}
            </div>
            <Button onClick={() => window.location.reload()} className="w-full">
              {t("retryConnection")}
            </Button>
          </div>
        ) : (
          <Auth
            supabaseClient={supabase}
            appearance={{ 
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#9b87f5',
                    brandAccent: '#8B5CF6',
                    brandButtonText: 'white',
                    defaultButtonBackground: '#1A1F2C',
                    defaultButtonBackgroundHover: '#2D3748',
                    inputBackground: 'transparent',
                    inputBorder: 'rgb(255 255 255 / 0.1)',
                    inputBorderHover: 'rgb(255 255 255 / 0.2)',
                    inputBorderFocus: '#9b87f5',
                    inputText: 'white',
                    inputLabelText: 'rgb(255 255 255 / 0.8)',
                    inputPlaceholder: 'rgb(255 255 255 / 0.4)',
                  }
                }
              },
              className: {
                container: 'text-white',
                label: 'text-white/80',
                button: 'glass-card hover:bg-white/10',
                input: 'glass-card bg-transparent'
              }
            }}
            providers={['google']}
            theme="dark"
            localization={{
              variables: {
                sign_up: {
                  email_label: 'Email',
                  password_label: 'Password',
                  button_label: t("signUp"),
                  link_text: t("signUp"),
                },
                sign_in: {
                  email_label: 'Email',
                  password_label: 'Password',
                  button_label: t("signIn"),
                  link_text: t("signIn"),
                },
                forgotten_password: {
                  link_text: "Forgot your password?",
                  email_label: 'Email',
                }
              }
            }}
          />
        )}
      </div>

      <Dialog open={isConnectionDialogOpen} onOpenChange={setIsConnectionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("connectionIssue")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>{t("connectionIssueDesc")}</p>
            <p>{t("possibleSolutions")}</p>
            <ul className="list-disc ps-5 space-y-1">
              <li>{t("checkInternet")}</li>
              <li>{t("verifyProject")}</li>
              <li>{t("checkCredentials")}</li>
              <li>{t("clearCache")}</li>
            </ul>
            <div className="flex justify-end space-x-2">
              <Button onClick={retryConnection}>{t("retryConnection")}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Login;
