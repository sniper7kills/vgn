import { useState } from 'react';
// import { Amplify } from 'aws-amplify';
// import outputs from '../amplify_outputs.json';
// import '@aws-amplify/ui-react/styles.css';

// Amplify.configure(outputs);

import { Button } from './components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';

// Import all forms
import GarageForm from './components/forms/GarageForm';
import ClubForm from './components/forms/ClubForm';
import ProjectForm from './components/forms/ProjectForm';
import PartForm from './components/forms/PartForm';
import EventForm from './components/forms/EventForm';
import LocationModal from './components/forms/LocationModal';

type FormType = 'garage' | 'club' | 'project' | 'part' | 'event' | null;

function App() {
  const [activeForm, setActiveForm] = useState<FormType>(null);
  const [showLocationModal, setShowLocationModal] = useState(false);

  const forms = [
    { id: 'garage', name: 'Garage Form', description: 'Create a new veteran garage' },
    { id: 'club', name: 'Club Form', description: 'Register a motorcycle club' },
    { id: 'project', name: 'Project Form', description: 'Start a new veteran project' },
    { id: 'part', name: 'Part Form', description: 'Add parts to inventory' },
    { id: 'event', name: 'Event Form', description: 'Create community events' },
  ];

  const renderForm = () => {
    switch (activeForm) {
      case 'garage':
        return <GarageForm />;
      case 'club':
        return <ClubForm />;
      case 'project':
        return <ProjectForm />;
      case 'part':
        return <PartForm />;
      case 'event':
        return <EventForm />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Veteran's Garage Network
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Form Examples - AWS Amplify Gen 2 with ShadCN UI
          </p>
        </div>

        {!activeForm ? (
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {forms.map((form) => (
                <Card key={form.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle>{form.name}</CardTitle>
                    <CardDescription>{form.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      onClick={() => setActiveForm(form.id as FormType)}
                      className="w-full"
                    >
                      Open Form
                    </Button>
                  </CardContent>
                </Card>
              ))}
              
              {/* Location Modal Demo */}
              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>Location Modal</CardTitle>
                  <CardDescription>Add waypoints and locations</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={() => setShowLocationModal(true)}
                    className="w-full"
                  >
                    Open Modal
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle>About This Demo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  This demo showcases form implementations for the Veteran's Garage Network using:
                </p>
                <ul className="list-disc list-inside space-y-2 text-sm">
                  <li><strong>AWS Amplify Gen 2</strong> - Backend and data management</li>
                  <li><strong>ShadCN UI</strong> - Modern, accessible component library</li>
                  <li><strong>React Hook Form</strong> - Form state management and validation</li>
                  <li><strong>TypeScript</strong> - Type safety and better developer experience</li>
                  <li><strong>Tailwind CSS</strong> - Utility-first styling</li>
                </ul>
                <p className="text-sm text-gray-600">
                  Each form demonstrates different input types, validation patterns, and complex data structures
                  that match the Amplify data models defined in the backend schema.
                </p>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto">
            <div className="mb-6">
              <Button 
                variant="outline" 
                onClick={() => setActiveForm(null)}
                className="mb-4"
              >
                ← Back to Form List
              </Button>
            </div>
            {renderForm()}
          </div>
        )}

        {/* Location Modal */}
        <LocationModal 
          isOpen={showLocationModal}
          onClose={() => setShowLocationModal(false)}
        />
      </div>
    </div>
  );
}

export default App;
