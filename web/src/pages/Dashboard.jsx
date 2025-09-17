import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslation } from '../utils/i18n';
import { 
  Calendar, 
  Users, 
  FileText, 
  Activity,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Plus
} from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const { userProfile } = useAuth();
  const { language } = useLanguage();
  const { t } = useTranslation(language);
  const [stats, setStats] = useState({
    appointments: 0,
    prescriptions: 0,
    reports: 0,
    pendingAppointments: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [appointmentsRes, prescriptionsRes, reportsRes] = await Promise.all([
        axios.get('/appointments/my'),
        axios.get('/prescriptions/my'),
        axios.get('/reports/my')
      ]);

      const appointments = appointmentsRes.data.appointments || [];
      const prescriptions = prescriptionsRes.data.prescriptions || [];
      const reports = reportsRes.data.reports || [];

      setStats({
        appointments: appointments.length,
        prescriptions: prescriptions.length,
        reports: reports.length,
        pendingAppointments: appointments.filter(apt => apt.status === 'pending').length
      });

      // Combine recent activity
      const activity = [
        ...appointments.slice(0, 3).map(apt => ({
          type: 'appointment',
          title: userProfile?.role === 'doctor' 
            ? `${language === 'pa' ? 'ਮੁਲਾਕਾਤ' : 'Appointment'} - ${apt.patient?.name}`
            : `${language === 'pa' ? 'ਮੁਲਾਕਾਤ' : 'Appointment'} - ${apt.doctor?.name}`,
          date: new Date(apt.scheduledAt),
          status: apt.status
        })),
        ...prescriptions.slice(0, 2).map(pres => ({
          type: 'prescription',
          title: language === 'pa' ? 'ਨਵਾਂ ਨੁਸਖਾ' : 'New prescription',
          date: new Date(pres.createdAt),
          status: 'completed'
        }))
      ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

      setRecentActivity(activity);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'accepted':
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const quickActions = userProfile?.role === 'doctor' ? [
    {
      title: language === 'pa' ? 'ਮੁਲਾਕਾਤਾਂ' : 'View Appointments',
      description: language === 'pa' ? 'ਆਉਣ ਵਾਲੀਆਂ ਮੁਲਾਕਾਤਾਂ ਦੇਖੋ' : 'Manage your upcoming appointments',
      icon: Calendar,
      link: '/appointments',
      color: 'bg-blue-500'
    },
    {
      title: language === 'pa' ? 'ਨੁਸਖੇ' : 'Prescriptions',
      description: language === 'pa' ? 'ਮਰੀਜ਼ਾਂ ਦੇ ਨੁਸਖੇ ਦੇਖੋ' : 'View patient prescriptions',
      icon: FileText,
      link: '/prescriptions',
      color: 'bg-green-500'
    }
  ] : [
    {
      title: language === 'pa' ? 'ਮੁਲਾਕਾਤ ਬੁੱਕ ਕਰੋ' : 'Book Appointment',
      description: language === 'pa' ? 'ਡਾਕਟਰ ਨਾਲ ਮੁਲਾਕਾਤ ਦਾ ਸਮਾਂ ਤੈਅ ਕਰੋ' : 'Schedule a consultation with a doctor',
      icon: Plus,
      link: '/book-appointment',
      color: 'bg-primary-500'
    },
    {
      title: language === 'pa' ? 'ਸਿਹਤ ਸਹਾਇਕ' : 'Health Assistant',
      description: language === 'pa' ? 'ਲੱਛਣਾਂ ਦੀ ਜਾਂਚ ਕਰੋ' : 'Check your symptoms with AI',
      icon: Activity,
      link: '/chatbot',
      color: 'bg-purple-500'
    },
    {
      title: language === 'pa' ? 'ਐਮਰਜੈਂਸੀ' : 'Emergency',
      description: language === 'pa' ? 'ਤੁਰੰਤ ਮਦਦ ਲਈ SOS' : 'Emergency help and SOS',
      icon: AlertTriangle,
      link: '/emergency',
      color: 'bg-red-500'
    }
  ];

  const statCards = [
    {
      title: language === 'pa' ? 'ਕੁੱਲ ਮੁਲਾਕਾਤਾਂ' : 'Total Appointments',
      value: stats.appointments,
      icon: Calendar,
      color: 'bg-blue-500'
    },
    {
      title: language === 'pa' ? 'ਬਕਾਇਆ' : 'Pending',
      value: stats.pendingAppointments,
      icon: Clock,
      color: 'bg-yellow-500'
    },
    {
      title: language === 'pa' ? 'ਨੁਸਖੇ' : 'Prescriptions',
      value: stats.prescriptions,
      icon: FileText,
      color: 'bg-green-500'
    },
    {
      title: language === 'pa' ? 'ਰਿਪੋਰਟਾਂ' : 'Reports',
      value: stats.reports,
      icon: FileText,
      color: 'bg-purple-500'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="spinner"></div>
        <span className="ml-2">{t('loading')}</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-2">
          {language === 'pa' ? 'ਜੀ ਆਇਆਂ ਨੂੰ' : 'Welcome back'}, {userProfile?.name}!
        </h1>
        <p className="text-primary-100">
          {userProfile?.role === 'doctor' 
            ? (language === 'pa' ? 'ਤੁਹਾਡੇ ਮਰੀਜ਼ਾਂ ਦੀ ਦੇਖਭਾਲ ਲਈ ਤਿਆਰ ਹਾਂ' : 'Ready to help your patients today')
            : (language === 'pa' ? 'ਤੁਹਾਡੀ ਸਿਹਤ ਸਾਡੀ ਪ੍ਰਾਥਮਿਕਤਾ ਹੈ' : 'Your health is our priority')
          }
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-lg card-shadow">
            <div className="flex items-center">
              <div className={`${stat.color} p-3 rounded-lg text-white mr-4`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.title}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {language === 'pa' ? 'ਤੁਰੰਤ ਕਾਰਵਾਈਆਂ' : 'Quick Actions'}
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              to={action.link}
              className="bg-white p-6 rounded-lg card-shadow card-shadow-hover hover:scale-105 transition-all duration-200"
            >
              <div className="flex items-start space-x-4">
                <div className={`${action.color} p-3 rounded-lg text-white`}>
                  <action.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{action.title}</h3>
                  <p className="text-sm text-gray-600">{action.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      {recentActivity.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {language === 'pa' ? 'ਹਾਲ ਦੀ ਗਤਿਵਿਧੀ' : 'Recent Activity'}
          </h2>
          <div className="bg-white rounded-lg card-shadow">
            <div className="divide-y divide-gray-200">
              {recentActivity.map((item, index) => (
                <div key={index} className="p-4 flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    {getStatusIcon(item.status)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {item.title}
                    </p>
                    <p className="text-sm text-gray-500">
                      {item.date.toLocaleDateString(language === 'pa' ? 'pa-IN' : 'en-IN')}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      item.status === 'accepted' || item.status === 'completed' ? 'bg-green-100 text-green-800' :
                      item.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {language === 'pa' 
                        ? (item.status === 'pending' ? 'ਬਕਾਇਆ' : 
                           item.status === 'accepted' ? 'ਸਵੀਕਾਰ' :
                           item.status === 'completed' ? 'ਪੂਰਾ' :
                           item.status === 'rejected' ? 'ਰੱਦ' : item.status)
                        : item.status
                      }
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;