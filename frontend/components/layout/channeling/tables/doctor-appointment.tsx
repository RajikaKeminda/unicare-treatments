// import { useState, useEffect } from 'react';
// import Link from 'next/link';
// import { apiService } from "@/libs/api";

// export default function AppointmentsPage() {
//   const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
//   const [appointments, setAppointments] = useState([]);
//   const [counts, setCounts] = useState({ total: 0, reschedules: 0, cancellations: 0 });
//   const [selectedStatus, setSelectedStatus] = useState('Queue');

//   useEffect(() => {
//     const fetchAppointments = async () => {
//       try {
//         const response = await apiService.get<{
//           appointments: Appointment[];
//           total: number;
//           reschedules: number;
//           cancellations: number;
//         }>(`/api/appointments?date=${selectedDate}`);
        
//         if (response.success) {
//           setAppointments(response.appointments);
//           setCounts({
//             total: response.total,
//             reschedules: response.reschedules,
//             cancellations: response.cancellations
//           });
//         }
//       } catch (error) {
//         console.error('Error fetching appointments:', error);
//       }
//     };
  
//     fetchAppointments();
//   }, [selectedDate]);

//   const handleRemove = async (appointmentId) => {
//     try {
//       await fetch(`/api/appointments/${appointmentId}`, { method: 'DELETE' });
//       setAppointments(appointments.filter(appt => appt.id !== appointmentId));
//     } catch (error) {
//       console.error('Error deleting appointment:', error);
//     }
//   };

//   const filteredAppointments = appointments.filter(appt => appt.status === selectedStatus);

//   return (
//     <div className="bg-gray-100 min-h-screen">
//       <div className="flex">
//         <div className="w-3/4 p-6">
//           <h1 className="text-2xl font-bold mb-6">Appointments page</h1>
          
//           <div className="flex space-x-4 mb-6">
//             <div className="flex items-center border p-2">
//               <input
//                 type="date"
//                 className="border-none focus:outline-none"
//                 value={selectedDate}
//                 onChange={(e) => setSelectedDate(e.target.value)}
//               />
//             </div>
//             <div className="border p-2">
//               <p>No of Appointments <span className="font-bold">{counts.total}</span></p>
//             </div>
//             <div className="border p-2">
//               <p>No of Reschedules <span className="font-bold">{counts.reschedules}</span></p>
//             </div>
//             <div className="border p-2">
//               <p>No of Cancellations <span className="font-bold">{counts.cancellations}</span></p>
//             </div>
//           </div>

//           <div className="bg-white p-4 rounded shadow mb-6">
//             <div className="flex space-x-4 mb-4">
//               {['Queue', 'Ongoing', 'Treated', 'No Show'].map((status) => (
//                 <button
//                   key={status}
//                   className={`px-4 py-2 rounded ${
//                     selectedStatus === status ? 'bg-blue-500 text-white' : 'bg-gray-200'
//                   }`}
//                   onClick={() => setSelectedStatus(status)}
//                 >
//                   {status}
//                 </button>
//               ))}
//             </div>

//             <div className="overflow-x-auto">
//               <table className="min-w-full bg-white">
//                 <thead>
//                   <tr>
//                     {['No.', 'Profile', 'Contact', 'Appointment', 'Status', 'Vitals', 'Call', 'Remove'].map((header) => (
//                       <th key={header} className="py-2 px-4 border">{header}</th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredAppointments.map((appointment, index) => (
//                     <tr key={appointment.id}>
//                       <td className="py-2 px-4 border">{index + 1}</td>
//                       <td className="py-2 px-4 border flex items-center">
//                         <img
//                           alt={`Profile picture of ${appointment.name}`}
//                           className="w-10 h-10 rounded-full mr-2"
//                           src={appointment.image || 'https://placehold.co/50x50'}
//                         />
//                         <div>
//                           <p>{appointment.name}</p>
//                           <p className="text-gray-500 text-sm">Age {appointment.age}</p>
//                         </div>
//                       </td>
//                       <td className="py-2 px-4 border">{appointment.contact}</td>
//                       <td className="py-2 px-4 border">{appointment.time}</td>
//                       <td className="py-2 px-4 border">{appointment.status}</td>
//                       <td className="py-2 px-4 border">
//                         <Link href={`/vitals/${appointment.id}`}>
//                           <i className="fas fa-heart cursor-pointer"></i>
//                         </Link>
//                       </td>
//                       <td className="py-2 px-4 border">
//                         <a href={`tel:${appointment.contact}`}>
//                           <i className="fas fa-phone cursor-pointer"></i>
//                         </a>
//                       </td>
//                       <td className="py-2 px-4 border">
//                         <i 
//                           className="fas fa-trash cursor-pointer text-red-500"
//                           onClick={() => handleRemove(appointment.id)}
//                         ></i>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           <div className="flex justify-between">
//             <Link href="/add-patient" className="flex items-center px-4 py-2 bg-white border rounded shadow">
//               <i className="fas fa-plus mr-2"></i>
//               Add Patient
//             </Link>
//             <Link href="/add-lab-reports" className="flex items-center px-4 py-2 bg-white border rounded shadow">
//               <i className="fas fa-file-alt mr-2"></i>
//               Add Lab Reports
//             </Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }