import Calculator from "@/components/Calculator";
import History from "@/components/History";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-primary">
          EV Charging Cost Calculator
        </h1>
        
        <Tabs defaultValue="calculator" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="calculator">Calculator</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="calculator">
            <Calculator />
          </TabsContent>
          
          <TabsContent value="history">
            <History />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;