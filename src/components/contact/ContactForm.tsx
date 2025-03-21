
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Send, AlertTriangle } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const PAUL_EMAIL = "paul@paulandcami.com"; 
const CAMI_EMAIL = "cami@paulandcami.com";
const EMAIL_ENDPOINT = "https://yourwebsite.com/send-email.php";

const ContactForm = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    service: "",
    specialist: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cookieConsent, setCookieConsent] = useState<string | null>(null);

  // Check cookie consent status on component mount
  useEffect(() => {
    const consent = localStorage.getItem("cookiesAccepted");
    setCookieConsent(consent);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if user has declined cookies
    if (cookieConsent === "false") {
      toast({
        title: "Unable to send message",
        description: "You need to accept our cookie policy to send messages. Please refresh the page and accept the cookie policy.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const toEmail = formData.specialist === "paul" ? PAUL_EMAIL : CAMI_EMAIL;
      const toName = formData.specialist === "paul" ? "Paul" : "Cami";
      
      const formDataToSend = new URLSearchParams();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('service', formData.service || 'Not specified');
      formDataToSend.append('message', formData.message);
      formDataToSend.append('to_email', toEmail);
      formDataToSend.append('to_name', toName);
      
      console.log("Sending email to:", toEmail);
      console.log("Form data:", Object.fromEntries(formDataToSend));
      
      const response = await fetch(EMAIL_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formDataToSend
      });
      
      const result = await response.text();
      console.log("Server response:", result);
      
      if (result === "success") {
        toast({
          title: "Message sent successfully!",
          description: `Your message has been sent to ${toName}. We'll get back to you soon.`,
        });
        
        setFormData({
          name: "",
          email: "",
          service: "",
          specialist: "",
          message: ""
        });
      } else {
        throw new Error("Failed to send email");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      toast({
        title: "Failed to send message",
        description: "There was an error sending your message. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = () => {
    return formData.name && formData.email && formData.message && formData.specialist;
  };

  return (
    <div className="lg:col-span-3 bg-black p-6 md:p-8 rounded-lg shadow-sm border border-gold">
      <h3 className="text-2xl font-bold mb-6 gold-gradient">Send a Message</h3>
      
      {cookieConsent === "false" && (
        <div className="mb-6 p-4 border border-red-400 bg-red-900/20 rounded-md flex items-start">
          <AlertTriangle className="text-red-400 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-red-400 font-medium">Cookie Policy Declined</p>
            <p className="text-silver text-sm mt-1">
              You've declined our cookie policy. To send messages, you need to accept our cookie policy. 
              Please refresh the page and accept when prompted.
            </p>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-silver mb-1">
            Your Name
          </label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            required
            className="w-full bg-black/50 border-gold/50 text-silver"
            disabled={cookieConsent === "false"}
          />
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-silver mb-1">
            Email Address
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="john@example.com"
            required
            className="w-full bg-black/50 border-gold/50 text-silver"
            disabled={cookieConsent === "false"}
          />
        </div>
        
        <div>
          <label htmlFor="service" className="block text-sm font-medium text-silver mb-1">
            Service of Interest
          </label>
          <Select 
            value={formData.service} 
            onValueChange={(value) => handleSelectChange("service", value)}
            disabled={cookieConsent === "false"}
          >
            <SelectTrigger className="bg-black/50 border-gold/50 text-silver">
              <SelectValue placeholder="Select a service" />
            </SelectTrigger>
            <SelectContent className="bg-black border-gold/50 text-silver">
              <SelectItem value="business-breakthrough" className="focus:bg-gold/20 focus:text-gold">Business Breakthrough Coaching</SelectItem>
              <SelectItem value="career-acceleration" className="focus:bg-gold/20 focus:text-gold">Career Acceleration Coaching</SelectItem>
              <SelectItem value="empowered-leadership" className="focus:bg-gold/20 focus:text-gold">Empowered Leadership Coaching</SelectItem>
              <SelectItem value="life-design" className="focus:bg-gold/20 focus:text-gold">Life Design Coaching</SelectItem>
              <SelectItem value="self-discovery" className="focus:bg-gold/20 focus:text-gold">Self-Discovery & Growth Coaching</SelectItem>
              <SelectItem value="momentum-motivation" className="focus:bg-gold/20 focus:text-gold">Momentum & Motivation Coaching</SelectItem>
              <SelectItem value="not-sure" className="focus:bg-gold/20 focus:text-gold">Not Sure Yet</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-silver mb-1">
            Your Message
          </label>
          <Textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Tell us about your goals and how we can help..."
            rows={5}
            required
            className="w-full bg-black/50 border-gold/50 text-silver"
            disabled={cookieConsent === "false"}
          />
        </div>
        
        <div>
          <label htmlFor="specialist" className="block text-sm font-medium text-silver mb-1">
            Choose Your Specialist <span className="text-red-400">*</span>
          </label>
          <Select 
            value={formData.specialist} 
            onValueChange={(value) => handleSelectChange("specialist", value)}
            required
            disabled={cookieConsent === "false"}
          >
            <SelectTrigger className="bg-black/50 border-gold/50 text-silver">
              <SelectValue placeholder="Select a specialist" />
            </SelectTrigger>
            <SelectContent className="bg-black border-gold/50 text-silver">
              <SelectItem value="paul" className="focus:bg-gold/20 focus:text-gold">Paul - paul@paulandcami.com</SelectItem>
              <SelectItem value="cami" className="focus:bg-gold/20 focus:text-gold">Cami - cami@paulandcami.com</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-black hover:bg-black text-gold border border-gold hover:text-silver hover:border-silver transition-colors"
          disabled={isSubmitting || !isFormValid() || cookieConsent === "false"}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gold" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Sending...
            </span>
          ) : (
            <span className="flex items-center justify-center">
              <Send className="mr-2 h-4 w-4" /> Send Message
            </span>
          )}
        </Button>
      </form>
    </div>
  );
};

export default ContactForm;
