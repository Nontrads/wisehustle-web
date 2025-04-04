// src/App.tsx
import React, { useState } from 'react';
import DailyPlanner from './components/DailyPlanner';
import FocusTimer from './components/FocusTimer';
import AgeCalculator from './components/AgeCalculator';
import BMICalculator from './components/BMICalculator';
import { Layout, Menu } from 'antd';
import 'antd/dist/reset.css'; // Updated import for Ant Design styles
import './App.css'; // Import custom styles
import logo from './logo.png'; // Import the logo

const { Header, Content } = Layout;

const items = [
    {
        key: '1',
        label: 'Daily Planner',
    },
    {
        key: '2',
        label: 'Focus Timer',
    },
    {
        key: '3',
        label: 'Age Calculator',
    },
    {
        key: '4',
        label: 'BMI Calculator',
    },
];

const App: React.FC = () => {
    const [current, setCurrent] = useState('1');

    const renderContent = () => {
        switch (current) {
            case '1':
                return <DailyPlanner />;
            case '2':
                return <FocusTimer />;
            case '3':
                return <AgeCalculator />;
            case '4':
                return <BMICalculator />;
            default:
                return <DailyPlanner />;
        }
    };

    return (
        <Layout style={{ minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
            <Header style={{ 
                padding: '0 50px', 
                background: 'white',
                display: 'flex',
                alignItems: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
                <img src={logo} alt="Logo" style={{ height: '40px', marginRight: '16px' }} />

                <Menu
                    theme="light"
                    mode="horizontal"
                    selectedKeys={[current]}
                    items={items}
                    onClick={e => setCurrent(e.key)}
                    style={{
                        flex: 1,
                        background: 'transparent',
                        minWidth: 0,
                    }}
                />
            </Header>
            <Content style={{ padding: '24px', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
                <div style={{
                    padding: '24px',
                    background: 'white',
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                }}>
                    {renderContent()}
                </div>
            </Content>
        </Layout>
    );
};

export default App;