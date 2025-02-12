
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          navigate("/");
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A1F2C] to-[#221F26] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 glass-card p-8 rounded-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            EV Charging Cost Calculator
          </h2>
          <p className="mt-2 text-center text-sm text-gray-300">
            Please sign in to continue
          </p>
        </div>
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
          providers={[]}
          theme="dark"
          localization={{
            variables: {
              sign_up: {
                email_label: 'אימייל',
                password_label: 'סיסמא',
                link_text: "אין לך חשבון, לחצו כאן ליצור"
              },
              sign_in: {
                email_label: 'אימייל',
                password_label: 'סיסמא',
                link_text: "יש לך חשבון? לחצו כאן להתחברות"
              },
              forgotten_password: {
                link_text: "שכחת סיסמא?",
                email_label: 'אימייל',
              }
            }
          }}
        />
      </div>
    </div>
  );
};

export default Login;
