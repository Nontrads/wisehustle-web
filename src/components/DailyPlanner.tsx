// src/components/DailyPlanner.tsx
import React, { useState, useEffect } from 'react';
// Replace Material-UI imports with Ant Design components
import { Input, Button, Space, Typography, message, Checkbox, Card, Modal } from 'antd';
import { EditOutlined, ExclamationCircleOutlined, DeleteOutlined, StarOutlined, StarFilled } from '@ant-design/icons';

const { Text } = Typography;
const { confirm } = Modal;
const { TextArea } = Input;

interface Task {
    id: number;
    text: string;
    completed: boolean;
    priority: boolean;
}

const DailyPlanner: React.FC = () => {
    const [task, setTask] = useState('');
    const [tasks, setTasks] = useState<Task[]>([]);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [newTaskText, setNewTaskText] = useState('');

    useEffect(() => {
        // Load tasks from local storage on component mount
        const savedTasks = localStorage.getItem('tasks');
        if (savedTasks) {
            setTasks(JSON.parse(savedTasks));
        }
    }, []);

    const addTask = () => {
        if (task.trim() === '') {
            message.error('Please enter a task.');
            return;
        }
        const newTask = { id: Date.now(), text: task, completed: false, priority: false };
        const updatedTasks = [...tasks, newTask];
        setTasks(updatedTasks);
        setTask('');
        localStorage.setItem('tasks', JSON.stringify(updatedTasks)); // Save to local storage
    };

    const removeTask = (id: number) => {
        confirm({
            title: 'Are you sure you want to delete this task?',
            icon: <ExclamationCircleOutlined />,
            onOk() {
                const updatedTasks = tasks.filter(task => task.id !== id);
                setTasks(updatedTasks);
                localStorage.setItem('tasks', JSON.stringify(updatedTasks)); // Save to local storage
            },
        });
    };

    const toggleTaskCompletion = (id: number) => {
        const updatedTasks = tasks.map(task => 
            task.id === id ? { ...task, completed: !task.completed } : task
        );
        setTasks(updatedTasks);
        localStorage.setItem('tasks', JSON.stringify(updatedTasks)); // Save to local storage
    };

    const toggleTaskPriority = (id: number) => {
        const updatedTasks = tasks.map(task => 
            task.id === id ? { ...task, priority: !task.priority } : task
        );
        setTasks(updatedTasks);
        localStorage.setItem('tasks', JSON.stringify(updatedTasks)); // Save to local storage
    };

    const openEditModal = (task: Task) => {
        setEditingTask(task);
        setNewTaskText(task.text);
    };

    const handleEditTask = () => {
        if (editingTask) {
            const updatedTasks = tasks.map(task => 
                task.id === editingTask.id ? { ...task, text: newTaskText } : task
            );
            setTasks(updatedTasks);
            localStorage.setItem('tasks', JSON.stringify(updatedTasks));
            setEditingTask(null);
            setNewTaskText('');
        }
    };

    return (
        <Space direction="vertical" style={{ width: '100%' }}>
            <Space.Compact style={{ width: '100%' }}>
                <TextArea 
                    placeholder="New Task" 
                    value={task} 
                    onChange={(e) => setTask(e.target.value)}
                    onPressEnter={addTask}
                    rows={4}
                />
                <Button type="primary" onClick={addTask}>Add</Button>
            </Space.Compact>
            <Space direction="vertical" style={{ marginTop: '16px', width: '100%' }}>
                {tasks.map((item) => (
                    <Card 
                        key={item.id}
                        style={{ 
                            marginBottom: '8px', 
                            border: item.priority ? '2px solid #ff4d4f' : '1px solid #d9d9d9', 
                            borderRadius: '4px', 
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                        }}
                    >
                        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                            <Checkbox 
                                checked={item.completed} 
                                onChange={() => toggleTaskCompletion(item.id)}
                            >
                                <Text style={{ textDecoration: item.completed ? 'line-through' : 'none' }}>
                                    {item.text}
                                </Text>
                            </Checkbox>
                            <Space>
                                <Button 
                                    type="link" 
                                    icon={<EditOutlined />} 
                                    onClick={() => openEditModal(item)}
                                />
                                <Button 
                                    type="link" 
                                    onClick={() => toggleTaskPriority(item.id)}
                                    style={{ color: item.priority ? '#ff4d4f' : undefined }}
                                    icon={item.priority ? <StarFilled /> : <StarOutlined />}
                                />
                                <Button 
                                    type="link" 
                                    danger 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeTask(item.id);
                                    }}
                                    icon={<DeleteOutlined />}
                                />
                            </Space>
                        </Space>
                    </Card>
                ))}
            </Space>

            {/* Modal for editing task */}
            <Modal
                title="Edit Task"
                visible={!!editingTask}
                onOk={handleEditTask}
                onCancel={() => setEditingTask(null)}
            >
                <TextArea 
                    value={newTaskText} 
                    onChange={(e) => setNewTaskText(e.target.value)} 
                    placeholder="Edit task"
                    rows={4}
                />
            </Modal>
        </Space>
    );
};

export default DailyPlanner;