
import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Lead, LeadStatus } from '@/types/leads';
import { useToast } from '@/hooks/use-toast';

interface LeadFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (lead: Partial<Lead>) => void;
  lead?: Lead;
}

const statusOptions: { value: LeadStatus; label: string }[] = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'qualified', label: 'Qualified' },
  { value: 'proposal', label: 'Proposal' },
  { value: 'negotiation', label: 'Negotiation' },
  { value: 'won', label: 'Won' },
  { value: 'lost', label: 'Lost' },
];

const LeadForm: React.FC<LeadFormProps> = ({ isOpen, onClose, onSave, lead }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Partial<Lead>>({
    name: '',
    email: '',
    phone: '',
    company: '',
    status: 'new',
    value: undefined,
    source: '',
  });

  // Load lead data when editing
  useEffect(() => {
    if (lead) {
      setFormData({
        id: lead.id,
        name: lead.name,
        email: lead.email,
        phone: lead.phone || '',
        company: lead.company || '',
        status: lead.status,
        value: lead.value,
        source: lead.source || '',
      });
    } else {
      // Reset form when adding new lead
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        status: 'new',
        value: undefined,
        source: '',
      });
    }
  }, [lead, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'value' ? parseFloat(value) || undefined : value,
    }));
  };

  const handleStatusChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      status: value as LeadStatus,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.email) {
      toast({
        title: "Error",
        description: "Name and email are required fields.",
        variant: "destructive",
      });
      return;
    }
    
    // Add timestamps for new leads
    if (!lead) {
      const now = new Date().toISOString();
      formData.createdAt = now;
      formData.updatedAt = now;
    } else {
      formData.updatedAt = new Date().toISOString();
    }
    
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {lead ? 'Edit Lead' : 'Add New Lead'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name *
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email *
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Phone
              </Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="company" className="text-right">
                Company
              </Label>
              <Input
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select
                value={formData.status}
                onValueChange={handleStatusChange}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="value" className="text-right">
                Value ($)
              </Label>
              <Input
                id="value"
                name="value"
                type="number"
                value={formData.value || ''}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="source" className="text-right">
                Source
              </Label>
              <Input
                id="source"
                name="source"
                value={formData.source}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LeadForm;
