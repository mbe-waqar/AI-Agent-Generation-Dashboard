// Agent Creator JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Theme Toggle Functionality
    const themeButtons = document.querySelectorAll('.theme-btn');
    const body = document.body;
    
    themeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            themeButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            if (this.dataset.theme === 'dark') {
                body.classList.add('dark-theme');
                localStorage.setItem('theme', 'dark');
            } else {
                body.classList.remove('dark-theme');
                localStorage.setItem('theme', 'light');
            }
        });
    });
    
    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-theme');
        document.querySelector('[data-theme="dark"]').classList.add('active');
        document.querySelector('[data-theme="light"]').classList.remove('active');
    }
    
    // Navigation Menu
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Progress Steps
    const steps = document.querySelectorAll('.step');
    steps.forEach((step, index) => {
        step.addEventListener('click', function() {
            steps.forEach(s => s.classList.remove('active'));
            this.classList.add('active');
            
            // You can add logic here to show/hide different form sections
            showFormSection(index);
        });
    });
    
    function showFormSection(stepIndex) {
        // This function would show different form sections based on the step
        // For now, we'll just log the step
        console.log('Showing step:', stepIndex);
    }
    
    // Model Selection
    const modelButtons = document.querySelectorAll('.model-btn');
    modelButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            modelButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Store selected model
            const selectedModel = this.dataset.model;
            localStorage.setItem('selectedModel', selectedModel);
            console.log('Selected model:', selectedModel);
        });
    });
    
    // Form Inputs
    const agentNameInput = document.getElementById('agentName');
    const universeInput = document.getElementById('universe');
    const topicExpertiseInput = document.getElementById('topicExpertise');
    const imageDescriptionInput = document.getElementById('imageDescription');
    
    // Auto-save functionality
    function autoSave() {
        const formData = {
            agentName: agentNameInput.value,
            universe: universeInput.value,
            topicExpertise: topicExpertiseInput.value,
            imageDescription: imageDescriptionInput.value,
            selectedModel: document.querySelector('.model-btn.active')?.dataset.model || 'anthropic'
        };
        
        localStorage.setItem('agentFormData', JSON.stringify(formData));
    }
    
    // Load saved form data
    function loadFormData() {
        const savedData = localStorage.getItem('agentFormData');
        if (savedData) {
            const formData = JSON.parse(savedData);
            agentNameInput.value = formData.agentName || '';
            universeInput.value = formData.universe || '';
            topicExpertiseInput.value = formData.topicExpertise || '';
            imageDescriptionInput.value = formData.imageDescription || '';
            
            // Set selected model
            if (formData.selectedModel) {
                modelButtons.forEach(btn => btn.classList.remove('active'));
                document.querySelector(`[data-model="${formData.selectedModel}"]`)?.classList.add('active');
            }
        }
    }
    
    // Add event listeners for auto-save
    [agentNameInput, universeInput, topicExpertiseInput, imageDescriptionInput].forEach(input => {
        input.addEventListener('input', autoSave);
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                autoSave();
                showToast('Changes saved!');
            }
        });
    });
    
    // Regenerate AI Image
    const regenerateBtn = document.getElementById('regenerateBtn');
    const characterImage = document.getElementById('characterImage');
    
    regenerateBtn.addEventListener('click', function() {
        // Show loading state
        regenerateBtn.innerHTML = '⏳ Generating...';
        regenerateBtn.disabled = true;
        
        // Simulate AI image generation
        setTimeout(() => {
            // Array of anime character images (you can replace with actual AI-generated images)
            const animeImages = [
                'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop&crop=face',
                'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=400&h=600&fit=crop&crop=face',
                'https://images.unsplash.com/photo-1506794778202-cad84cf45f62?w=400&h=600&fit=crop&crop=face',
                'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&crop=face',
                'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=600&fit=crop&crop=face'
            ];
            
            const randomImage = animeImages[Math.floor(Math.random() * animeImages.length)];
            characterImage.src = randomImage;
            
            // Reset button
            regenerateBtn.innerHTML = '🔄 Regenerate AI';
            regenerateBtn.disabled = false;
            
            showToast('New character generated!');
        }, 2000);
    });
    
    // Save Agent
    const saveBtn = document.querySelector('.save-btn');
    saveBtn.addEventListener('click', function() {
        const formData = {
            agentName: agentNameInput.value.trim(),
            universe: universeInput.value.trim(),
            topicExpertise: topicExpertiseInput.value.trim(),
            imageDescription: imageDescriptionInput.value.trim(),
            selectedModel: document.querySelector('.model-btn.active')?.dataset.model || 'anthropic',
            characterImage: characterImage.src,
            createdAt: new Date().toISOString()
        };
        
        // Validation
        if (!formData.agentName) {
            showToast('Please enter an agent name', 'error');
            return;
        }
        
        // Show loading state
        saveBtn.innerHTML = '⏳ Saving...';
        saveBtn.disabled = true;
        
        // Simulate saving
        setTimeout(() => {
            // Save to localStorage (in real app, this would be sent to server)
            const savedAgents = JSON.parse(localStorage.getItem('savedAgents') || '[]');
            savedAgents.push(formData);
            localStorage.setItem('savedAgents', JSON.stringify(savedAgents));
            
            // Reset button
            saveBtn.innerHTML = '💾 Save Agent';
            saveBtn.disabled = false;
            
            showToast('Agent saved successfully!', 'success');
        }, 1500);
    });
    
    // Toast notification system
    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        
        // Add toast styles
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: ${type === 'error' ? '#ff4444' : type === 'success' ? '#44ff44' : '#4444ff'};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(toast);
        
        // Remove toast after 3 seconds
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }
    
    // Add CSS for toast animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    // Initialize
    loadFormData();
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + S to save
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            saveBtn.click();
        }
        
        // Ctrl/Cmd + R to regenerate (when focused on image section)
        if ((e.ctrlKey || e.metaKey) && e.key === 'r' && e.target.closest('.image-section')) {
            e.preventDefault();
            regenerateBtn.click();
        }
    });
    
    // Image hover effect
    characterImage.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.05)';
        this.style.transition = 'transform 0.3s ease';
    });
    
    characterImage.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
    
    // Responsive sidebar toggle for mobile
    function createMobileToggle() {
        if (window.innerWidth <= 768) {
            const sidebar = document.querySelector('.sidebar');
            const toggleBtn = document.createElement('button');
            toggleBtn.innerHTML = '☰';
            toggleBtn.className = 'mobile-toggle';
            toggleBtn.style.cssText = `
                position: fixed;
                top: 20px;
                left: 20px;
                z-index: 1001;
                background: #333;
                color: white;
                border: none;
                border-radius: 4px;
                padding: 8px 12px;
                font-size: 16px;
                cursor: pointer;
            `;
            
            document.body.appendChild(toggleBtn);
            
            toggleBtn.addEventListener('click', function() {
                sidebar.classList.toggle('mobile-open');
            });
        }
    }
    
    // Initialize mobile toggle
    createMobileToggle();
    
    // Reinitialize on window-resize
    window.addEventListener('resize', function() {
        // Remove existing mobile toggle
        const existingToggle = document.querySelector('.mobile-toggle');
        if (existingToggle) {
            existingToggle.remove();
        }
        
        // Recreate if needed
        createMobileToggle();
    });
});