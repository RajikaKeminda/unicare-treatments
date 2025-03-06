export default function PatientList() {
  const patients = [
    { id: "001", name: "John" },
    { id: "002", name: "Emily" },
    { id: "003", name: "Alex" },
    { id: "004", name: "Jane" },
    { id: "005", name: "Peter" },
    { id: "006", name: "Sophie" },
    { id: "007", name: "Michael" },
    { id: "008", name: "Liam" },
    { id: "009", name: "Olivia" },
    { id: "010", name: "Lucas" }

  ];

  return (
    <div className="p-6 max-w-4xl mx-auto text-center">
      <h1 className="text-black text-xl font-bold">👨‍⚕️ Welcome, Dr. Jone Doe</h1><br/>
      <div className="flex justify-center gap-6 text-gray-700 mb-4">
        <span>&#128203; Total Patients: <strong>150</strong></span> |
        <span>&#x267B; Ongoing: <strong>40</strong></span> |
        <span>&#128203; Completed: <strong>110</strong></span>
      </div><br/><br/>
      
      <div className="flex justify-center gap-4 mb-4">
        <input
          type="text"
          placeholder="🔍 Search Patient ID"
          className="border px-3 py-2 rounded"
        />
        <button className="border px-4 py-2 rounded bg-gray-200">➕ Add Treatment</button>
      </div><br/>

      <table className="w-full border-collapse border text-left">
        <thead className="bg-gray-500 text-white">
          <tr>
            <th className="p-2 border">Patient ID</th>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">View Treatment</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient, index) => (
            <tr key={index} className="bg-gray-100 text-sm">
              <td className="p-2 border text-center">{patient.id}</td>
              <td className="p-2 border text-center">{patient.name}</td>
              <td className="p-2 border text-center">
                <button className="px-4 py-1 bg-gray-500 text-white rounded">View</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
