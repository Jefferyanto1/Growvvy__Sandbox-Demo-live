import { Card, CardContent } from "@/components/ui/card";

export default function DemoPage() {
  return (
    <Card>
      <CardContent className="pt-6">

         {/* Description */}
      <p className="font-jakarta text-[14px] font-medium text-[#1A202C]">
        This feature is under development
      </p>

        {/* Badge */}
      <div className="inline-block px-3 py-1 text-[12px] font-medium rounded-full bg-[#F3F5F7] text-[#596780]">
        Coming soon
      </div>

      </CardContent>
    </Card>
  );
}