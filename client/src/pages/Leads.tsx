// client/src/pages/Leads.tsx
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import LeadCard from '@/components/leads/LeadCard';
import LeadForm from '@/components/leads/LeadForm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Lead, LeadStatus } from '@/types/leads';
import { useToast } from '@/hooks/use-toast';
import LeadsService from '@/services/leads.service';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from '@/components/ui/alert-dialog';

const Leads: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentLead, setCurrentLead] = useState<Lead | undefined>(undefined);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  
  const { toast } = useToast();

  // Fetch leads from API
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        setIsLoading(true);
        const data = await LeadsService.getAllLeads();
        setLeads(data);
        setFilteredLeads(data);
      } catch (error) {
        console.error('Error fetching leads:', error);
        toast({
          title: "Error",
          description: "Failed to load leads. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeads();
  }, []);

  // Handle search and filtering
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    applyFilters(term, statusFilter);
  };

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
    applyFilters(searchTerm, value);
  };

  const applyFilters = (term: string, status: string) => {
    let filtered = leads;
    
    // Apply search term filter
    if (term) {
      filtered = filtered.filter(lead => 
        (lead.firstName && lead.firstName.toLowerCase().includes(term)) ||
        (lead.lastName && lead.lastName.toLowerCase().includes(term)) ||
        (lead.name && lead.name.toLowerCase().includes(term)) ||
        lead.email.toLowerCase().includes(term) ||
        (lead.company && lead.company.toLowerCase().includes(term))
      );
    }
    
    // Apply status filter
    if (status !== 'all') {
      filtered = filtered.filter(lead => lead.status === status);
    }
    
    setFilteredLeads(filtered);
  };

  // CRUD operations
  const handleAddLead = () => {
    setCurrentLead(undefined);
    setIsFormOpen(true);
  };

  const handleEditLead = (lead: Lead) => {
    setCurrentLead(lead);
    setIsFormOpen(true);
  };

  const handleDeleteLead = (leadId: string) => {
    setLeadToDelete(leadId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteLead = async () => {
    try {
      await LeadsService.deleteLead(leadToDelete);
      
      const updatedLeads = leads.filter(lead => lead.id !== leadToDelete);
      setLeads(updatedLeads);
      setFilteredLeads(updatedLeads.filter(lead => 
        (statusFilter === 'all' || lead.status === statusFilter) &&
        (lead.name.toLowerCase().includes(searchTerm) ||
         lead.email.toLowerCase().includes(searchTerm) ||
         (lead.company && lead.company.toLowerCase().includes(searchTerm)))
      ));
      
      toast({
        title: "Lead deleted",
        description: "The lead has been deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting lead:', error);
      toast({
        title: "Error",
        description: "Failed to delete lead. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleteDialogOpen(false);
    }
  };

  const handleSaveLead = async (leadData: Partial<Lead>) => {
    try {
      if (currentLead) {
        // Update existing lead
        // Extract only the fields expected by the server and ensure correct types
        const updateLeadData = {
          id: currentLead.id,
          firstName: leadData.firstName || '',
          lastName: leadData.lastName || '',
          email: leadData.email || '',
          phone: leadData.phone || '',
          company: leadData.company || '',
          status: leadData.status || 'new',
          value: typeof leadData.value === 'number' ? leadData.value : undefined,
          source: leadData.source || '',
          notes: typeof leadData.notes === 'string' ? leadData.notes : ''
        };
        
        try {
          const updatedLead = await LeadsService.updateLead(updateLeadData);
          
          const updatedLeads = leads.map(lead => 
            lead.id === currentLead.id ? updatedLead : lead
          );
          
          setLeads(updatedLeads);
          setFilteredLeads(updatedLeads.filter(lead => 
            (statusFilter === 'all' || lead.status === statusFilter) &&
            ((lead.firstName && lead.firstName.toLowerCase().includes(searchTerm)) ||
             (lead.lastName && lead.lastName.toLowerCase().includes(searchTerm)) ||
             (lead.name && lead.name.toLowerCase().includes(searchTerm)) ||
             lead.email.toLowerCase().includes(searchTerm) ||
             (lead.company && lead.company.toLowerCase().includes(searchTerm)))
          ));
          
          toast({
            title: "Lead updated",
            description: "The lead has been updated successfully.",
          });
        } catch (error) {
          console.error('Error updating lead:', error);
          // Check if we can get more details from the error
          if (error.response) {
            console.error('Server response data:', error.response.data);
            console.error('Server response status:', error.response.status);
          }
          toast({
            title: "Error",
            description: "Failed to update lead. Please check the console for details.",
            variant: "destructive",
          });
        }
      } else {
        // Add new lead
        // Extract only the fields expected by the server
        const createLeadData = {
          firstName: leadData.firstName || '',
          lastName: leadData.lastName || '',
          email: leadData.email || '',
          phone: leadData.phone || '',
          company: leadData.company || '',
          status: leadData.status || 'new',
          value: typeof leadData.value === 'number' ? leadData.value : undefined,
          source: leadData.source || '',
          notes: typeof leadData.notes === 'string' ? leadData.notes : ''
        };
        
        const newLead = await LeadsService.createLead(createLeadData);
        
        const updatedLeads = [...leads, newLead];
        setLeads(updatedLeads);
        
        // Apply current filters to the updated leads
        const shouldInclude = 
          (statusFilter === 'all' || newLead.status === statusFilter) &&
          ((newLead.firstName && newLead.firstName.toLowerCase().includes(searchTerm)) ||
           (newLead.lastName && newLead.lastName.toLowerCase().includes(searchTerm)) ||
           (newLead.name && newLead.name.toLowerCase().includes(searchTerm)) ||
           newLead.email.toLowerCase().includes(searchTerm) ||
           (newLead.company && newLead.company.toLowerCase().includes(searchTerm)));
        
        if (shouldInclude) {
          setFilteredLeads([...filteredLeads, newLead]);
        }
        
        toast({
          title: "Lead added",
          description: "The lead has been added successfully.",
        });
      }
      
      setIsFormOpen(false);
    } catch (error) {
      console.error('Error saving lead:', error);
      toast({
        title: "Error",
        description: "Failed to save lead. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Status options for filtering
  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'new', label: 'New' },
    { value: 'contacted', label: 'Contacted' },
    { value: 'qualified', label: 'Qualified' },
    { value: 'proposal', label: 'Proposal' },
    { value: 'negotiation', label: 'Negotiation' },
    { value: 'won', label: 'Won' },
    { value: 'lost', label: 'Lost' },
  ];

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Leads</h1>
            <p className="text-muted-foreground">
              Manage your sales leads and opportunities.
            </p>
          </div>
          <Button onClick={handleAddLead}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add New Lead
          </Button>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input 
              placeholder="Search leads by name, email, or company"
              value={searchTerm}
              onChange={handleSearch}
              className="w-full"
            />
          </div>
          <div className="w-full md:w-48">
            <Select value={statusFilter} onValueChange={handleStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
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
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-8">
            <p>Loading leads...</p>
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="rounded-lg border border-dashed p-8 text-center">
            <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-muted-foreground mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <h3 className="mt-4 text-lg font-semibold">No leads found</h3>
              <p className="mb-4 mt-2 text-sm text-muted-foreground">
                {searchTerm || statusFilter !== 'all' 
                  ? "No leads match your current search filters. Try adjusting your search criteria."
                  : "You haven't added any leads yet. Get started by adding your first lead."}
              </p>
              <Button onClick={handleAddLead}>Add New Lead</Button>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredLeads.map((lead) => (
              <LeadCard 
                key={lead.id} 
                lead={lead} 
                onEdit={handleEditLead} 
                onDelete={handleDeleteLead} 
              />
            ))}
          </div>
        )}
      </div>
      
      <LeadForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        onSave={handleSaveLead}
        lead={currentLead}
      />
      
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the lead and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteLead}
              className="bg-red-500 hover:bg-red-600 focus:ring-red-500"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default Leads;