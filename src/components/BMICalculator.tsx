import React, { useState } from 'react';
import { Input, Button, Space, Typography, message } from 'antd';

const { Text } = Typography;

const BMICalculator: React.FC = () => {
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [bmi, setBmi] = useState<number | null>(null);
    const [feedback, setFeedback] = useState<string>('');

    const validateInputs = () => {
        if (!weight.trim() || !height.trim()) {
            message.error('Please enter both weight and height.');
            return false;
        }
        
        const w = parseFloat(weight);
        const h = parseFloat(height);
        
        if (isNaN(w) || w <= 0) {
            message.error('Please enter a valid weight.');
            return false;
        }
        if (isNaN(h) || h <= 0) {
            message.error('Please enter a valid height.');
            return false;
        }
        return true;
    };

    const calculateBMI = () => {
        if (!validateInputs()) return;
        
        const h = parseFloat(height) / 100; // Convert height to meters
        const w = parseFloat(weight);
        const bmiValue = w / (h * h);
        setBmi(bmiValue);
        provideFeedback(bmiValue);
    };

    const provideFeedback = (bmiValue: number) => {
        if (bmiValue < 18.5) {
            setFeedback('You are underweight. Consider consulting with a healthcare provider.');
        } else if (bmiValue >= 18.5 && bmiValue < 24.9) {
            setFeedback('You have a normal weight. Keep up the good work!');
        } else if (bmiValue >= 25 && bmiValue < 29.9) {
            setFeedback('You are overweight. Consider a balanced diet and regular exercise.');
        } else {
            setFeedback('You are in the obese range. It is advisable to consult with a healthcare provider.');
        }
    };

    return (
        <Space direction="vertical" style={{ width: '100%' }}>
            <Input 
                placeholder="Weight (kg)" 
                value={weight} 
                onChange={(e) => setWeight(e.target.value)}
            />
            <Input 
                placeholder="Height (cm)" 
                value={height} 
                onChange={(e) => setHeight(e.target.value)}
            />
            <Button type="primary" onClick={calculateBMI} style={{ width: '100%' }}>
                Calculate BMI
            </Button>
            {bmi !== null && (
                <Text style={{ textAlign: 'center', display: 'block' }}>
                    Your BMI is: {bmi.toFixed(2)}
                </Text>
            )}
            {feedback && (
                <Text style={{ textAlign: 'center', display: 'block', marginTop: '10px' }}>
                    {feedback}
                </Text>
            )}
        </Space>
    );
};

export default BMICalculator;