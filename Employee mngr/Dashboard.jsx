import React, { useState, useEffect } from 'react';

const Dashboard = ({ token }) => {
  const [stats, setStats] = useState({
    total_candidates: 0,
    applied: 0,
    interviewing: 0,
    offered: 0,
    approved: 0,
    pending_review: 0,
    conversion_rate: 0,
    total_employees: 0,
    active_employees: 0,
    recent_hires: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch candidate statistics
      const candidateResponse = await fetch('/api/candidates/pipeline-stats', {
        credentials: 'include'
      });
      const candidateStats = await candidateResponse.json();

      // Fetch employee statistics  
      const employeeResponse = await fetch('/api/employees/stats', {
        credentials: 'include'
      });
      const employeeStats = await employeeResponse.json();

      setStats({
        total_candidates: candidateStats.total || 0,
        applied: candidateStats.applied || 0,
        interviewing: candidateStats.interviewing || 0,
        offered: candidateStats.offered || 0,
        approved: candidateStats.approved || 0,
        pending_review: candidateStats.pending || 0,
        conversion_rate: candidateStats.conversion_rate || 0,
        total_employees: employeeStats.total || 0,
        active_employees: employeeStats.active || 0,
        recent_hires: employeeStats.recent_hires || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return (
    <div className="dashboard">
      <h2>Staff Management System</h2>
      <p>Comprehensive platform for managing candidates and employees</p>
      
      {/* Statistics Cards */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
        <div style={{ 
          backgroundColor: '#4285f4', 
          color: 'white', 
          padding: '20px', 
          borderRadius: '8px',
          flex: 1,
          textAlign: 'center'
        }}>
          <h3>{stats.total_candidates}</h3>
          <p>Total Candidates</p>
          <small>Active in pipeline</small>
        </div>
        
        <div style={{ 
          backgroundColor: '#34a853', 
          color: 'white', 
          padding: '20px', 
          borderRadius: '8px',
          flex: 1,
          textAlign: 'center'
        }}>
          <h3>{stats.approved}</h3>
          <p>Approved</p>
          <small>Ready for hiring</small>
        </div>
        
        <div style={{ 
          backgroundColor: '#ff9800', 
          color: 'white', 
          padding: '20px', 
          borderRadius: '8px',
          flex: 1,
          textAlign: 'center'
        }}>
          <h3>{stats.pending_review}</h3>
          <p>Pending Review</p>
          <small>Awaiting decision</small>
        </div>
        
        <div style={{ 
          backgroundColor: '#9c27b0', 
          color: 'white', 
          padding: '20px', 
          borderRadius: '8px',
          flex: 1,
          textAlign: 'center'
        }}>
          <h3>{stats.conversion_rate}%</h3>
          <p>Conversion Rate</p>
          <small>Application to hire</small>
        </div>
      </div>

      {/* Pipeline and Employee Overview */}
      <div style={{ display: 'flex', gap: '30px' }}>
        <div style={{ flex: 1 }}>
          <h3>Candidate Pipeline</h3>
          <p>Current status of all candidates in the hiring process</p>
          
          <div style={{ marginTop: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span>Applied</span>
              <span>{stats.applied}</span>
            </div>
            <div style={{ backgroundColor: '#f0f0f0', height: '8px', borderRadius: '4px', marginBottom: '15px' }}>
              <div style={{ 
                backgroundColor: '#333', 
                height: '100%', 
                width: stats.total_candidates > 0 ? `${(stats.applied / stats.total_candidates) * 100}%` : '0%',
                borderRadius: '4px' 
              }}></div>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span>Interviewing</span>
              <span>{stats.interviewing}</span>
            </div>
            <div style={{ backgroundColor: '#f0f0f0', height: '8px', borderRadius: '4px', marginBottom: '15px' }}>
              <div style={{ 
                backgroundColor: '#666', 
                height: '100%', 
                width: stats.total_candidates > 0 ? `${(stats.interviewing / stats.total_candidates) * 100}%` : '0%',
                borderRadius: '4px' 
              }}></div>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span>Offered</span>
              <span>{stats.offered}</span>
            </div>
            <div style={{ backgroundColor: '#f0f0f0', height: '8px', borderRadius: '4px', marginBottom: '15px' }}>
              <div style={{ 
                backgroundColor: '#999', 
                height: '100%', 
                width: stats.total_candidates > 0 ? `${(stats.offered / stats.total_candidates) * 100}%` : '0%',
                borderRadius: '4px' 
              }}></div>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span>Approved</span>
              <span>{stats.approved}</span>
            </div>
            <div style={{ backgroundColor: '#f0f0f0', height: '8px', borderRadius: '4px' }}>
              <div style={{ 
                backgroundColor: '#ccc', 
                height: '100%', 
                width: stats.total_candidates > 0 ? `${(stats.approved / stats.total_candidates) * 100}%` : '0%',
                borderRadius: '4px' 
              }}></div>
            </div>
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <h3>Employee Overview</h3>
          <p>Current workforce statistics</p>
          
          <div style={{ marginTop: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
              <span>👥 Total Employees</span>
              <span>{stats.total_employees}</span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
              <span>📋 Active Contracts</span>
              <span>{stats.active_employees}</span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
              <span>🆕 Recent Hires</span>
              <span>{stats.recent_hires}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div style={{ marginTop: '30px' }}>
        <h3>Recent Activity</h3>
        <p>Latest updates in the system</p>
        
        <div style={{ marginTop: '15px' }}>
          {stats.total_candidates > 0 || stats.total_employees > 0 ? (
            <div>
              {stats.total_candidates > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <div style={{ width: '8px', height: '8px', backgroundColor: '#4285f4', borderRadius: '50%' }}></div>
                  <span>{stats.total_candidates} candidate{stats.total_candidates !== 1 ? 's' : ''} in pipeline</span>
                </div>
              )}
              {stats.total_employees > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '8px', height: '8px', backgroundColor: '#34a853', borderRadius: '50%' }}></div>
                  <span>{stats.total_employees} employee{stats.total_employees !== 1 ? 's' : ''} in system</span>
                </div>
              )}
            </div>
          ) : (
            <div style={{ color: '#666', fontStyle: 'italic' }}>
              No recent activity. Add candidates or employees to get started.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

