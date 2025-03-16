
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Send } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const ContactForm = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, service: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      
      // Success message
      toast({
        title: "Message sent!",
        description: "We'll get back to you as soon as possible.",
      });
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        service: "",
        message: ""
      });
    }, 1500);
  };

  return (
    <div className="lg:col-span-3 bg-black p-6 md:p-8 rounded-lg shadow-sm border border-gold">
      <h3 className="text-2xl font-bold mb-6 gold-gradient">Send a Message</h3>
      
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
          />
        </div>
        
        <div className={`${isMobile ? 'space-y-4' : 'grid grid-cols-1 md:grid-cols-2 gap-5'}`}>
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
            />
          </div>
          
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-silver mb-1">
              Phone Number
            </label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+40 700 000 000"
              className="w-full bg-black/50 border-gold/50 text-silver"
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="service" className="block text-sm font-medium text-silver mb-1">
            Service of Interest
          </label>
          <Select value={formData.service} onValueChange={handleSelectChange}>
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
          />
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-black hover:bg-black text-gold border border-gold hover:text-silver hover:border-silver transition-colors"
          disabled={isSubmitting}
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
