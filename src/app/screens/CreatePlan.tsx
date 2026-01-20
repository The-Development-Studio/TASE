import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { machines } from '@/data/mockData';
import { toast } from 'sonner';

export const CreatePlan = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    machineName: '',
    orderNo: '',
    partNumber: '',
    partName: '',
    planQuantity: '',
    startDate: '',
    priority: 'Medium',
    travellerNo: '',
    fixtureNo: '',
    programName: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Plan created successfully!');
    navigate('/plans');
  };

  const handleSaveDraft = () => {
    toast.success('Draft saved successfully!');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Create PPC Plan</h1>
        <p className="text-sm text-gray-500">Create a new production plan for manufacturing</p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Plan Details</CardTitle>
            <CardDescription>Fill in the production plan information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="machineName">Machine Name *</Label>
                <Select
                  value={formData.machineName}
                  onValueChange={(value) => setFormData({ ...formData, machineName: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select machine" />
                  </SelectTrigger>
                  <SelectContent>
                    {machines.map((machine) => (
                      <SelectItem key={machine} value={machine}>
                        {machine}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="orderNo">Order No *</Label>
                <Input
                  id="orderNo"
                  value={formData.orderNo}
                  onChange={(e) => setFormData({ ...formData, orderNo: e.target.value })}
                  placeholder="ORD-2024-XXX"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="partNumber">Part Number *</Label>
                <Input
                  id="partNumber"
                  value={formData.partNumber}
                  onChange={(e) => setFormData({ ...formData, partNumber: e.target.value })}
                  placeholder="P-XXXX"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="partName">Part Name *</Label>
                <Input
                  id="partName"
                  value={formData.partName}
                  onChange={(e) => setFormData({ ...formData, partName: e.target.value })}
                  placeholder="Enter part name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="planQuantity">Plan Quantity *</Label>
                <Input
                  id="planQuantity"
                  type="number"
                  value={formData.planQuantity}
                  onChange={(e) => setFormData({ ...formData, planQuantity: e.target.value })}
                  placeholder="0"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority *</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) => setFormData({ ...formData, priority: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="travellerNo">Traveller No *</Label>
                <Input
                  id="travellerNo"
                  value={formData.travellerNo}
                  onChange={(e) => setFormData({ ...formData, travellerNo: e.target.value })}
                  placeholder="TRV-XXX"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fixtureNo">Fixture No *</Label>
                <Input
                  id="fixtureNo"
                  value={formData.fixtureNo}
                  onChange={(e) => setFormData({ ...formData, fixtureNo: e.target.value })}
                  placeholder="FIX-XXX"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="programName">Program Name *</Label>
                <Input
                  id="programName"
                  value={formData.programName}
                  onChange={(e) => setFormData({ ...formData, programName: e.target.value })}
                  placeholder="PROG_XXX"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button type="button" variant="outline" onClick={handleSaveDraft}>
                Save Draft
              </Button>
              <Button type="submit">Publish Plan</Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};
