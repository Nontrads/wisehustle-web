// src/components/FocusTimer.tsx
import React, { useState, useEffect } from 'react';
import { Button, Space, Typography, Card, Progress, InputNumber, Row, Col, Divider } from 'antd';
import { PlayCircleOutlined, PauseCircleOutlined, ReloadOutlined, SettingOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;

type TimerMode = 'focus' | 'break';

interface TimerSettings {
    focusMinutes: number; // Total minutes for focus
    breakMinutes: number; // Total minutes for break
}

const FocusTimer: React.FC = () => {
    const [isActive, setIsActive] = useState(false);
    const [seconds, setSeconds] = useState(0);
    const [mode, setMode] = useState<TimerMode>('focus');
    const [settings, setSettings] = useState<TimerSettings>({
        focusMinutes: 25,
        breakMinutes: 5
    });
    const [showSettings, setShowSettings] = useState(false);

    const getTotalSeconds = (minutes: number) => minutes * 60;

    const totalSeconds = mode === 'focus' 
        ? getTotalSeconds(settings.focusMinutes)
        : getTotalSeconds(settings.breakMinutes);

    const remaining = totalSeconds - seconds; // Calculate remaining time
    const progress = Math.round((remaining / totalSeconds) * 100); // Progress based on remaining time
    const displayHours = Math.floor(remaining / 3600);
    const displayMinutes = Math.floor((remaining % 3600) / 60);
    const displaySeconds = remaining % 60;

    const playNotificationSound = () => {
        const context = new AudioContext();
        const oscillator = context.createOscillator();
        const gainNode = context.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(context.destination);
        
        oscillator.type = 'sine';
        oscillator.frequency.value = 800;
        gainNode.gain.value = 0.5;
        
        oscillator.start();
        gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.5);
        oscillator.stop(context.currentTime + 0.5);
    };

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isActive) {
            interval = setInterval(() => {
                setSeconds(prev => {
                    if (prev + 1 >= totalSeconds) {
                        playNotificationSound();
                        setSeconds(0); // Reset seconds for the next timer
                        setMode(prev => prev === 'focus' ? 'break' : 'focus'); // Switch mode
                        return 0; // Reset seconds for the next timer
                    }
                    return prev + 1; // Increment seconds
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isActive, seconds, totalSeconds]);

    const toggleTimer = () => {
        setIsActive(!isActive);
    };

    const resetTimer = () => {
        setIsActive(false);
        setSeconds(0);
        setMode('focus');
    };

    const toggleSettings = () => {
        setShowSettings(!showSettings);
    };

    return (
        <Space direction="vertical" style={{ width: '100%' }}>
            <Card>
                <Space direction="vertical" style={{ width: '100%', textAlign: 'center' }}>
                    <Title level={4} style={{ margin: '0 0 20px 0', color: mode === 'focus' ? '#1890ff' : '#52c41a' }}>
                        {mode === 'focus' ? 'Focus Time' : 'Break Time'}
                    </Title>
                    
                    <Progress
                        type="circle"
                        percent={progress}
                        format={() => (
                            <Text style={{ fontSize: '24px', fontFamily: 'monospace' }}>
                                {displayHours > 0 ? `${displayHours}:` : ''}
                                {`${displayMinutes.toString().padStart(2, '0')}:${displaySeconds.toString().padStart(2, '0')}`}
                            </Text>
                        )}
                        strokeColor={mode === 'focus' ? '#1890ff' : '#52c41a'} // Different color for break
                    />

                    <Space size="middle" style={{ margin: '20px 0' }}>
                        <Button 
                            type="primary"
                            icon={isActive ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
                            onClick={toggleTimer}
                            size="large"
                        >
                            {isActive ? 'Pause' : 'Start'}
                        </Button>
                        <Button 
                            icon={<ReloadOutlined />}
                            onClick={resetTimer}
                            size="large"
                        >
                            Reset
                        </Button>
                        <Button 
                            icon={<SettingOutlined />}
                            onClick={toggleSettings}
                            size="large"
                        >
                            Settings
                        </Button>
                    </Space>

                    {showSettings && (
                        <Card size="small" style={{ textAlign: 'left' }}>
                            <Space direction="vertical" style={{ width: '100%' }}>
                                <Title level={5}>Focus Time</Title>
                                <Row gutter={16}>
                                    <Col span={24}>
                                        <Text>Minutes:</Text>
                                        <InputNumber
                                            min={1}
                                            value={settings.focusMinutes}
                                            onChange={(value) => setSettings(prev => ({ 
                                                ...prev, 
                                                focusMinutes: value || 25 
                                            }))}
                                            style={{ width: '100%', marginTop: '8px' }}
                                        />
                                    </Col>
                                </Row>

                                <Divider style={{ margin: '12px 0' }} />

                                <Title level={5}>Break Time</Title>
                                <Row gutter={16}>
                                    <Col span={24}>
                                        <Text>Minutes:</Text>
                                        <InputNumber
                                            min={1}
                                            value={settings.breakMinutes}
                                            onChange={(value) => setSettings(prev => ({ 
                                                ...prev, 
                                                breakMinutes: value || 5 
                                            }))}
                                            style={{ width: '100%', marginTop: '8px' }}
                                        />
                                    </Col>
                                </Row>
                            </Space>
                        </Card>
                    )}
                </Space>
            </Card>
        </Space>
    );
};

export default FocusTimer;