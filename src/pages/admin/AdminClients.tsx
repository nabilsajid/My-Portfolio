import ClientsEditor from "./components/ClientsEditor";

const AdminClients = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Client Logos</h1>
        <p className="text-muted-foreground mt-2">Manage the logos displayed in the Clients section.</p>
      </div>
      
      <ClientsEditor />
    </div>
  );
};

export default AdminClients;
