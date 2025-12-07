module.exports = {
  tutorialsSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Module 1 – ROS 2: The Robotic Nervous System',
      items: [
        'module-1-ros2/intro',
        'module-1-ros2/chapter-1-ros-basics',
        'module-1-ros2/chapter-2-nodes-topics',
        'module-1-ros2/chapter-3-rclpy-agents',
        'module-1-ros2/chapter-4-urdf-for-humanoids',
      ],
    },
    {
      type: 'category',
      label: 'Module 2 – Digital Twin (Gazebo & Unity)',
      items: [
        'module-2-digital-twin/intro',
        'module-2-digital-twin/chapter-1-gazebo-physics',
        'module-2-digital-twin/chapter-2-unity-visualization',
        'module-2-digital-twin/chapter-3-sensor-simulation',
      ],
    },
    {
      type: 'category',
      label: 'Module 3 – NVIDIA Isaac Platform',
      items: [
        'module-3-isaac/intro',
        'module-3-isaac/chapter-1-isaac-sim',
        'module-3-isaac/chapter-2-vslam',
        'module-3-isaac/chapter-3-navigation-nav2',
      ],
    },
    {
      type: 'category',
      label: 'Module 4 – Vision-Language-Action',
      items: [
        'module-4-vla/intro',
        'module-4-vla/chapter-1-whisper',
        'module-4-vla/chapter-2-llm-planning',
        'module-4-vla/chapter-3-capstone-autonomous-humanoid',
      ],
    },
  ],
};

