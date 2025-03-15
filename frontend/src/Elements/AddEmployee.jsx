import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { notify } from '../utils';
import { CreateEmployee, UpdateEmployeeById } from '../api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Upload, X } from 'lucide-react';

const AddEmployee = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const eventObj = location.state?.employee;

  const [event, setEvent] = useState({
    name: '',
    about: '',
    location: '',
    city: '',
    capacity: '',
    scale: 'public',
    profileImage: null,
    startAt: null,
    endAt: null
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [updateMode, setUpdateMode] = useState(false);

  useEffect(() => {
    if (eventObj) {
      setEvent({
        ...eventObj,
        startAt: eventObj.startAt ? new Date(eventObj.startAt) : null,
        endAt: eventObj.endAt ? new Date(eventObj.endAt) : null
      });
      setUpdateMode(true);
      // If there's an existing image URL
      if (eventObj.profileImage) {
        setImagePreview(eventObj.profileImage);
      }
    }
  }, [eventObj]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEvent({ ...event, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEvent({ ...event, profileImage: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setEvent({ ...event, profileImage: null });
    setImagePreview(null);
  };

  const handleDateChange = (date, field) => {
    setEvent({ ...event, [field]: date });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = {
        ...event,
        capacity: Number(event.capacity)
      };

      const { success, message } = updateMode
        ? await UpdateEmployeeById(formData, id)
        : await CreateEmployee(formData);
      
      if (success) {
        notify(message, 'success');
        navigate('/dashboard/employee');
      } else {
        notify(message, 'error');
      }
    } catch (err) {
      console.error(err);
      notify('Failed to save event', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-4xl">
        <div className="backdrop-blur-lg bg-black/30 rounded-xl shadow-2xl border border-gray-700">
          <Card className="bg-transparent">
            <CardHeader className="border-b border-gray-700">
              <CardTitle className="text-2xl font-bold text-white">
                {updateMode ? 'Update Event' : 'Add New Event'}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Image Preview Section */}
                <div className="mb-8">
                  <Label className="text-gray-200 mb-2 block">Event Image</Label>
                  <div className="flex items-center space-x-4">
                    <div className="relative w-40 h-40 border-2 border-dashed border-gray-600 rounded-lg overflow-hidden">
                      {imagePreview ? (
                        <div className="relative h-full">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={removeImage}
                            className="absolute top-2 right-2 p-1 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
                          >
                            <X className="w-4 h-4 text-white" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full p-4">
                          <Upload className="w-8 h-8 text-gray-400" />
                          <p className="text-sm text-gray-400 text-center mt-2">
                            Upload Image
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <Input
                        type="file"
                        onChange={handleFileChange}
                        accept="image/*"
                        className="cursor-pointer bg-gray-800 text-gray-200 border-gray-700 hover:bg-gray-700 transition-colors"
                      />
                      <p className="text-sm text-gray-400 mt-2">
                        Recommended: 800x800px or larger
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Basic Information */}
                  <div className="space-y-6">
                    <div>
                      <Label className="text-gray-200">Event Name</Label>
                      <Input
                        name="name"
                        value={event.name}
                        onChange={handleChange}
                        required
                        className="bg-gray-800 border-gray-700 text-gray-200 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <Label className="text-gray-200">About</Label>
                      <Textarea
                        name="about"
                        value={event.about}
                        onChange={handleChange}
                        required
                        className="h-32 bg-gray-800 border-gray-700 text-gray-200 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <Label className="text-gray-200">Location</Label>
                      <Input
                        name="location"
                        value={event.location}
                        onChange={handleChange}
                        required
                        className="bg-gray-800 border-gray-700 text-gray-200"
                      />
                    </div>
                  </div>

                  {/* Additional Details */}
                  <div className="space-y-6">
                    <div>
                      <Label className="text-gray-200">Venue</Label>
                      <Input
                        name="Breed"
                        value={event.Breed}
                        onChange={handleChange}
                        required
                        className="bg-gray-800 border-gray-700 text-gray-200"
                      />
                    </div>

                    <div>
                      <Label className="text-gray-200">Capacity</Label>
                      <Input
                        type="number"
                        name="capacity"
                        value={event.capacity}
                        onChange={handleChange}
                        required
                        min="0"
                        className="bg-gray-800 border-gray-700 text-gray-200"
                      />
                    </div>

                    <div>
                    
                      <select
                        name="scale"
                        value={event.scale}
                        onChange={handleChange}
                        className="w-full rounded-md bg-gray-800 border-gray-700 text-gray-200 focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="public">Public</option>
                        <option value="private">Private</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Date Range */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <Label className="text-gray-200">Start Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {event.startAt ? format(event.startAt, 'PPP') : 'Pick a date'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-gray-800 border-gray-700">
                        <Calendar
                          mode="single"
                          selected={event.startAt}
                          onSelect={(date) => handleDateChange(date, 'startAt')}
                          className="bg-gray-800 text-gray-200"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div>
                    <Label className="text-gray-200">End Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {event.endAt ? format(event.endAt, 'PPP') : 'Pick a date'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-gray-800 border-gray-700">
                        <Calendar
                          mode="single"
                          selected={event.endAt}
                          onSelect={(date) => handleDateChange(date, 'endAt')}
                          className="bg-gray-800 text-gray-200"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-4 pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/dashboard/employee')}
                    className="bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    {updateMode ? 'Update Event' : 'Create Event'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AddEmployee;