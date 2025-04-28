import { FiUsers, FiCalendar, FiActivity, FiDroplet, FiHeart, FiTrendingUp, FiAlertCircle, FiPlusCircle, FiPlay } from 'react-icons/fi';
import { FaLeaf, FaMedal, FaRegCalendarAlt, FaChartLine } from 'react-icons/fa';
import { GiHerbsBundle } from 'react-icons/gi';

export default function DashboardPage() {
  // Sample data - in a real app this would come from your backend
  const stats = {
    patients: 1242,
    activeTreatments: 87,
    revenue: '$48,750',
    satisfactionRate: '94%',
    upcomingAppointments: 15,
    treatmentCompletion: '78%'
  };

  const recentAppointments = [
    { id: 1, name: 'Sarah Johnson', time: 'Today, 10:30 AM', treatment: 'Acupuncture' },
    { id: 2, name: 'Michael Chen', time: 'Today, 2:15 PM', treatment: 'Ayurvedic Consultation' },
    { id: 3, name: 'Emma Wilson', time: 'Tomorrow, 9:00 AM', treatment: 'Reiki Healing' },
    { id: 4, name: 'David Kim', time: 'Tomorrow, 11:45 AM', treatment: 'Holistic Nutrition' }
  ];

  const treatmentStats = [
    { name: 'Acupuncture', count: 32 },
    { name: 'Ayurveda', count: 28 },
    { name: 'Reiki', count: 18 },
    { name: 'Nutrition', count: 24 },
    { name: 'Yoga Therapy', count: 15 }
  ];

  const ayurvedaProducts = [
    { id: 1, name: 'Triphala Powder', stock: 42, threshold: 10, price: '$24.99' },
    { id: 2, name: 'Ashwagandha Capsules', stock: 15, threshold: 15, price: '$29.99' },
    { id: 3, name: 'Brahmi Oil', stock: 8, threshold: 5, price: '$18.50' },
    { id: 4, name: 'Neem Soap', stock: 36, threshold: 20, price: '$9.99' },
    { id: 5, name: 'Turmeric Golden Milk', stock: 22, threshold: 15, price: '$14.99' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">UniCare Holistic Center</h1>
          <p className="text-green-600 font-medium">Admin Dashboard</p>
        </div>
        <div className="mt-4 md:mt-0 bg-white px-4 py-2 rounded-full shadow-sm flex items-center">
          <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
          <span className="text-sm text-gray-600">System Status: Operational</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
        <DashboardCard 
          title="Total Patients" 
          value={stats.patients.toLocaleString()} 
          icon={<FiUsers className="text-green-500" size={24} />}
          trend="up"
        />
        <DashboardCard 
          title="Active Treatments" 
          value={stats.activeTreatments} 
          icon={<FiActivity className="text-blue-500" size={24} />}
        />
        <DashboardCard 
          title="Monthly Revenue" 
          value={stats.revenue} 
          icon={<FiTrendingUp className="text-purple-500" size={24} />}
          trend="up"
        />
        <DashboardCard 
          title="Satisfaction Rate" 
          value={stats.satisfactionRate} 
          icon={<FiHeart className="text-red-400" size={24} />}
        />
        <DashboardCard 
          title="Upcoming Appointments" 
          value={stats.upcomingAppointments} 
          icon={<FiCalendar className="text-yellow-500" size={24} />}
        />
        <DashboardCard 
          title="Treatment Completion" 
          value={stats.treatmentCompletion} 
          icon={<FaMedal className="text-teal-500" size={24} />}
        />
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FaLeaf className="text-green-500 mr-2" /> Quick Actions
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <ActionButton 
                label="New Patient" 
                icon={<FiUsers size={18} />}
                color="bg-green-500 hover:bg-green-600"
              />
              <ActionButton 
                label="Schedule" 
                icon={<FaRegCalendarAlt size={18} />}
                color="bg-blue-500 hover:bg-blue-600"
              />
              <ActionButton 
                label="Treatment Plan" 
                icon={<FiDroplet size={18} />}
                color="bg-purple-500 hover:bg-purple-600"
              />
              <ActionButton 
                label="Reports" 
                icon={<FaChartLine size={18} />}
                color="bg-teal-500 hover:bg-teal-600"
              />
            </div>
          </div>

          {/* Upcoming Appointments */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FiCalendar className="text-blue-500 mr-2" /> Upcoming Appointments
            </h2>
            <div className="space-y-4">
              {recentAppointments.map(appointment => (
                <div key={appointment.id} className="flex items-center p-3 hover:bg-green-50 rounded-lg transition">
                  <div className="bg-green-100 p-2 rounded-full mr-3">
                    <FiCalendar className="text-green-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800">{appointment.name}</h3>
                    <p className="text-sm text-gray-600">{appointment.treatment}</p>
                  </div>
                  <div className="text-sm font-medium text-gray-700">{appointment.time}</div>
                </div>
              ))}
              <button className="w-full py-2 text-green-600 font-medium rounded-lg hover:bg-green-50 transition">
                View All Appointments
              </button>
            </div>
          </div>

          {/* Ayurveda Products Inventory */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <GiHerbsBundle className="text-yellow-600 mr-2" /> Ayurveda Products Inventory
              </h2>
              <button className="flex items-center text-sm bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg">
                <FiPlusCircle className="mr-1" /> Add Product
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Threshold</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {ayurvedaProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-green-50">
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{product.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{product.stock}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{product.threshold}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{product.price}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${product.stock < product.threshold ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                          {product.stock < product.threshold ? 'Low Stock' : 'In Stock'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Treatment Statistics */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Treatment Statistics</h2>
            <div className="space-y-4">
              {treatmentStats.map((treatment, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">{treatment.name}</span>
                    <span className="text-gray-500">{treatment.count} patients</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${index % 3 === 0 ? 'bg-green-500' : index % 3 === 1 ? 'bg-blue-500' : 'bg-purple-500'}`} 
                      style={{ width: `${(treatment.count / 40) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          

          {/* Alerts & Notifications */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FiAlertCircle className="text-yellow-500 mr-2" /> Alerts
            </h2>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
              <div className="flex">
                <div className="flex-shrink-0">
                  <FiAlertCircle className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    Dr. Patel will be unavailable next Tuesday. Reschedule 3 appointments.
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-4 bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
              <div className="flex">
                <div className="flex-shrink-0">
                  <FiAlertCircle className="h-5 w-5 text-blue-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    5 patients have upcoming treatment plan reviews this week.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
  <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
    <FiPlay className="text-blue-500 mr-2" /> Video Instructions
  </h2>
  <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
    <div className="flex">
      <div className="flex-shrink-0">
        <FiPlay className="h-5 w-5 text-blue-400" />
      </div>
      <div className="ml-3">
        <p className="text-sm text-blue-700 font-medium mb-1">Getting Started Guide</p>
        <p className="text-xs text-blue-600">5:32 min • Last updated 2 days ago</p>
      </div>
    </div>
  </div>
  <div className="mt-4 bg-purple-50 border-l-4 border-purple-400 p-4 rounded">
    <div className="flex">
      <div className="flex-shrink-0">
        <FiPlay className="h-5 w-5 text-purple-400" />
      </div>
      <div className="ml-3">
        <p className="text-sm text-purple-700 font-medium mb-1">Inventory Management</p>
        <p className="text-xs text-purple-600">12:15 min • Last updated 1 week ago</p>
      </div>
    </div>
  </div>
  <div className="mt-4 bg-green-50 border-l-4 border-green-400 p-4 rounded">
    <div className="flex">
      <div className="flex-shrink-0">
        <FiPlay className="h-5 w-5 text-green-400" />
      </div>
      <div className="ml-3">
        <p className="text-sm text-green-700 font-medium mb-1">Patient Onboarding</p>
        <p className="text-xs text-green-600">8:47 min • Last updated 3 days ago</p>
      </div>
    </div>
  </div>
</div>


        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ActivityItem 
            title="New Patient Registered" 
            description="Emma Wilson signed up for holistic nutrition program"
            time="2 hours ago"
            icon={<FiUsers className="text-green-500" />}
          />
          <ActivityItem 
            title="Appointment Completed" 
            description="Michael Chen finished acupuncture session"
            time="4 hours ago"
            icon={<FiHeart className="text-blue-500" />}
          />
          <ActivityItem 
            title="Treatment Plan Updated" 
            description="Dr. Patel updated Sarah Johnson's ayurvedic plan"
            time="1 day ago"
            icon={<FiDroplet className="text-purple-500" />}
          />
        </div>
      </div>
    </div>
  );
}

type DashboardCardProps = {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: 'up' | 'down';
};

function DashboardCard({ title, value, icon, trend }: DashboardCardProps) {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition">
      <div className="flex justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
        </div>
        <div className="bg-green-50 p-3 rounded-lg h-fit">
          {icon}
        </div>
      </div>
      {trend && (
        <div className={`mt-3 text-sm font-medium flex items-center ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
          {trend === 'up' ? '↑ 12% from last month' : '↓ 5% from last month'}
        </div>
      )}
    </div>
  );
}

type ActionButtonProps = {
  label: string;
  icon: React.ReactNode;
  color: string;
};

function ActionButton({ label, icon, color }: ActionButtonProps) {
  return (
    <button
      className={`${color} text-white font-medium py-3 px-4 rounded-xl transition flex items-center justify-center space-x-2`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

type ActivityItemProps = {
  title: string;
  description: string;
  time: string;
  icon: React.ReactNode;
};

function ActivityItem({ title, description, time, icon }: ActivityItemProps) {
  return (
    <div className="border border-gray-100 rounded-lg p-4 hover:bg-green-50 transition">
      <div className="flex items-start">
        <div className="bg-green-100 p-2 rounded-full mr-3">
          {icon}
        </div>
        <div>
          <h3 className="font-medium text-gray-800">{title}</h3>
          <p className="text-sm text-gray-600 mt-1">{description}</p>
          <p className="text-xs text-gray-400 mt-2">{time}</p>
        </div>
      </div>
    </div>
  );
}