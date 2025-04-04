// src/components/AgeCalculator.tsx
import React, { useState, useEffect } from 'react';
import { DatePicker, Space, Typography, Card, Tabs, Statistic } from 'antd';
import dayjs from 'dayjs';

const { Text } = Typography;
const { TabPane } = Tabs;

interface AgeDetail {
    years: number;
    months: number;
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    totalMonths: number;
    totalDays: number;
    totalHours: number;
    totalMinutes: number;
    totalSeconds: number;
}

const AgeCalculator: React.FC = () => {
    const today = new Date().toISOString().split('T')[0];
    const [birthDate, setBirthDate] = useState<string>(today);
    const [comparisonDate, setComparisonDate] = useState<string>(today);
    const [age, setAge] = useState<AgeDetail | null>(null);
    const [, setCurrentTime] = useState(new Date());

    useEffect(() => {
        calculateAge(birthDate, comparisonDate);
        const timer = setInterval(() => {
            setCurrentTime(new Date());
            calculateAge(birthDate, comparisonDate);
        }, 1000);

        return () => clearInterval(timer);
    }, [birthDate, comparisonDate]);

    const calculateAge = (birthDate: string, comparisonDate: string) => {
        const birth = new Date(birthDate);
        const today = new Date(comparisonDate);

        if (birth > today) return;

        let years = today.getFullYear() - birth.getFullYear();
        let months = today.getMonth() - birth.getMonth();
        let days = today.getDate() - birth.getDate();
        let hours = today.getHours() - birth.getHours();
        let minutes = today.getMinutes() - birth.getMinutes();
        let seconds = today.getSeconds() - birth.getSeconds();

        // Adjust negative values
        if (seconds < 0) {
            minutes--;
            seconds += 60;
        }
        if (minutes < 0) {
            hours--;
            minutes += 60;
        }
        if (hours < 0) {
            days--;
            hours += 24;
        }
        if (days < 0) {
            months--;
            const daysInMonth = new Date(today.getFullYear(), today.getMonth(), 0).getDate();
            days += daysInMonth;
        }
        if (months < 0) {
            years--;
            months += 12;
        }

        const totalMonths = years * 12 + months;
        const timeDiff = today.getTime() - birth.getTime();
        const totalDays = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const totalHours = Math.floor(timeDiff / (1000 * 60 * 60));
        const totalMinutes = Math.floor(timeDiff / (1000 * 60));
        const totalSeconds = Math.floor(timeDiff / 1000);

        setAge({
            years, months, days, hours, minutes, seconds,
            totalMonths, totalDays, totalHours, totalMinutes, totalSeconds
        });
    };

    return (
        <Space direction="vertical" style={{ width: '100%' }}>
            <DatePicker 
                style={{ width: '100%' }}
                onChange={(date) => setBirthDate(date?.format('YYYY-MM-DD') || today)}
                format="YYYY-MM-DD"
                placeholder="Select your birth date"
                disabledDate={(current) => current && current.valueOf() > Date.now()}
            />
            <DatePicker 
                style={{ width: '100%' }}
                onChange={(date) => setComparisonDate(date?.format('YYYY-MM-DD') || today)}
                format="YYYY-MM-DD"
                placeholder="Pick a Date to See Age As of That Day"
                disabledDate={(current) => 
                    current && (current.valueOf() > Date.now() || current.valueOf() < dayjs(birthDate).valueOf())
                }
            />
            {age && (
                <Card size="small" style={{ width: '100%' }}>
                    <Tabs defaultActiveKey="1">
                        <TabPane tab="Precise Age" key="1">
                            <Space direction="vertical" style={{ width: '100%' }}>
                                <Text strong style={{ fontSize: '16px', textAlign: 'center', display: 'block' }}>
                                    {age.years} years, {age.months} months, {age.days} days
                                </Text>
                                <Text style={{ textAlign: 'center', display: 'block' }}>
                                    {age.hours} hours, {age.minutes} minutes, {age.seconds} seconds
                                </Text>
                            </Space>
                        </TabPane>
                        <TabPane tab="Total Values" key="2">
                            <Space direction="vertical" size="small" style={{ width: '100%' }}>
                                <Statistic title="Total Years" value={age.years} />
                                <Statistic title="Total Months" value={age.totalMonths} />
                                <Statistic title="Total Days" value={age.totalDays} />
                                <Statistic title="Total Hours" value={age.totalHours} />
                                <Statistic title="Total Minutes" value={age.totalMinutes} />
                                <Statistic title="Total Seconds" value={age.totalSeconds} />
                            </Space>
                        </TabPane>
                    </Tabs>
                </Card>
            )}
        </Space>
    );
};

export default AgeCalculator;