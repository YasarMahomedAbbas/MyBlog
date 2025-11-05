import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

export default function ContactUsPage() {
  return (
    <div className="pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Contact Us
          </h1>
          <p className="text-xl text-muted-foreground">
            Get in touch with our team. We'd love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <Card className="p-6 text-center">
            <h3 className="font-semibold text-foreground mb-2">Email</h3>
            <p className="text-muted-foreground">hello@appname.com</p>
          </Card>
          <Card className="p-6 text-center">
            <h3 className="font-semibold text-foreground mb-2">Phone</h3>
            <p className="text-muted-foreground">+1 (555) 123-4567</p>
          </Card>
          <Card className="p-6 text-center">
            <h3 className="font-semibold text-foreground mb-2">Address</h3>
            <p className="text-muted-foreground">
              123 Business Ave
              <br />
              City, State 12345
            </p>
          </Card>
        </div>

        <div className="text-center">
          <Button size="lg" className="gap-2">
            Send us a Message
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
