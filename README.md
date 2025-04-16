# Salifort Motors Project Showcase

## Introduction

Welcome to the Salifort Motors Project Showcase! This project is a comprehensive analysis aimed at understanding and improving employee retention at Salifort Motors. The accompanying [webpage](index.html) provides an interactive, in-depth look into the data analysis, modeling processes, and key findings.

## Table of Contents
- [Project Goal](#project-goal)
- [Data Exploration](#data-exploration)
- [Predictive Modeling](#predictive-modeling)
- [Key Findings & Recommendations](#key-findings--recommendations)
- [Webpage Features](#webpage-features)
- [About the Project](#about-the-project)

## Project Goal

Salifort Motors faced challenges with employee turnover. This project uses data analysis and machine learning to identify the key factors driving attrition and provide actionable recommendations for the HR department to improve retention, morale, and productivity.

## Data Exploration

### Dataset Overview
The analysis is based on a dataset covering 15,000 employees across 10 key attributes:
- **satisfaction_level**: Employee-reported job satisfaction (0–1)
- **last_evaluation**: Performance review score (0–1)
- **number_project**: Number of projects assigned
- **average_monthly_hours**: Average monthly work hours
- **time_spend_company**: Years at Salifort
- **Work_accident**: Whether the employee had a workplace accident (0=No, 1=Yes)
- **left**: Whether the employee left the company (0=No, 1=Yes - Target Variable)
- **promotion_last_5years**: Whether the employee received a promotion in the last 5 years (0=No, 1=Yes)
- **Department**: Employee's department
- **salary**: Salary category (low, medium, high)

### Initial Insights & Visualizations
Exploratory Data Analysis (EDA) revealed key patterns. The webpage showcases 15 visualizations, including:

1.  **Boxplot of Tenure**: Median tenure is 3 years, with most employees staying 2-4 years.
    ![Boxplot of Tenure](images/image_1.png)
2.  **Correlation Heatmap**: Shows relationships, notably a negative correlation between satisfaction and leaving.
    ![Correlation Heatmap](images/image_2.png)
3.  **Turnover by Department**: Sales, Technical, and Support departments show higher attrition numbers.
    ![Employees Leaving by Department](images/image_3.png)
4.  **Turnover by Salary Level**: Low salary is strongly linked to higher attrition.
    ![Employees Leaving by Salary Level](images/image_4.png)
5.  **Overall Salary Distribution**: Most employees are in low or medium salary bands.
    ![Distribution of Salary Levels](images/image_12.png)
6.  **Satisfaction Level Distribution**: Bimodal distribution indicates polarized satisfaction levels.
    ![Distribution of Satisfaction Levels](images/image_5.png)
7.  **Evaluation Score Distribution**: Peaks suggest distinct performance groups or rating patterns.
    ![Distribution of Last Evaluation Scores](images/image_6.png)
8.  **Project Load Distribution**: Most employees handle 3-4 projects; extremes exist.
    ![Number of Projects Undertaken by Employees](images/image_7.png)
9.  **Average Monthly Hours Distribution**: Clusters suggest different work intensity patterns (potential burnout risk).
    ![Distribution of Average Monthly Hours](images/image_8.png)
10. **Employee Tenure Distribution (Bar Chart)**: Confirms the 3-year peak and drop-off after 5 years.
    ![Number of Years Employees Have Spent with the Company](images/image_9.png)
11. **Promotion Impact on Turnover**: Promotions strongly correlate with retention; few employees were promoted.
    ![Promotions in the Last 5 Years vs. Leaving](images/image_10.png)
12. **Work Accidents and Retention**: Surprisingly, employees with accidents were less likely to leave.
    ![Work Accidents vs. Leaving](images/image_11.png)
13. **Model Predictive Power (ROC Curve)**: Visualizes the high accuracy of Random Forest and XGBoost models (AUC ~0.98).
    ![ROC Curve](images/image_15.png)
14. **Key Turnover Drivers (Random Forest)**: Ranks satisfaction, tenure, projects, evaluation, and hours as top factors.
    ![Top 10 Important Features - Random Forest](images/image_13.png)
15. **Key Turnover Drivers (XGBoost)**: Similar ranking, highlighting projects, satisfaction, tenure, hours, and evaluation.
    ![Top 10 Important Features - XGBoost](images/image_14.png)

## Predictive Modeling

### Approach
The project followed the PACE framework (Plan, Analyze, Construct, Execute). Three models were built to predict employee turnover:
- Logistic Regression (Baseline)
- Random Forest (Ensemble)
- XGBoost (Gradient Boosting Ensemble)

### Model Performance (Test Set)
- **Logistic Regression**:
  - Accuracy: ~78%
  - Precision: ~73%
  - Recall: ~69%
  - F1-Score: ~71%
- **Random Forest**:
  - Accuracy: **97.83%**
  - Precision: **98%**
  - Recall: **89%**
  - F1-Score: **93%**
- **XGBoost**:
  - Accuracy: **97.96%**
  - Precision: **98%**
  - Recall: **90%**
  - F1-Score: **94%**

**XGBoost** was selected as the champion model due to its slightly superior performance.

### Feature Importance
Both Random Forest and XGBoost identified the following as the most critical factors influencing turnover:
- **Satisfaction Level**
- **Time Spent at Company (Tenure)**
- **Number of Projects**
- **Average Monthly Hours**
- **Last Evaluation Score**

## Key Findings & Recommendations

### Summary of Findings
Turnover at Salifort Motors is significantly driven by low satisfaction, the critical 3-5 year tenure window, imbalanced workloads (projects/hours), lower evaluation scores, lack of promotions, and low salary.

### Strategic Recommendations
1.  **Boost Satisfaction:** Implement regular monitoring (e.g., pulse surveys) and address concerns related to pay, workload, and recognition.
2.  **Manage Workload:** Ensure fair project distribution, addressing both potential burnout and disengagement.
3.  **Focus on Mid-Tenure:** Develop clear career paths and growth opportunities for employees with 3-5 years of service.
4.  **Enhance Performance Management:** Ensure fairness and link evaluations to development.
5.  **Recognize & Promote:** Improve visibility of career paths, recognize contributions, and review compensation competitiveness.

### Next Steps
- Conduct qualitative analysis (exit interviews, focus groups) for deeper insights.
- Pilot targeted retention programs for high-risk employee segments.
- Regularly retrain the predictive model with new data.

## Webpage Features

The `index.html` showcase page includes:
- **Modern Design**: Clean layout, professional color scheme, gradient backgrounds, and subtle shadows.
- **Interactive Elements**: Smooth scrolling, sticky navigation, collapsible sections for detailed content, image zoom functionality, and tooltips.
- **Animations**: Fade-in and slide-in effects for content sections.
- **Accessibility**: Semantic HTML, ARIA attributes for interactive elements (collapsibles, overlay), focus management for the image overlay.
- **Responsiveness**: Adapts to different screen sizes.

## About the Project

This project demonstrates the application of data analysis and machine learning to solve a real-world business problem. It was completed as part of the Google Advanced Data Analytics Professional Certificate.

- **Author**: Tobin Zolkowski
- **Course**: Google Advanced Data Analytics Capstone
- **Dataset Credit**: Coursera / Google
- **Project Code**: [Python Notebooks/Code](https://github.com/tzolkowski96/tzolkowski96/tree/main/Employee-Churn-Prediction) (Link to original analysis code)
- **Showcase Repository**: [GitHub Repository](https://github.com/tzolkowski96/Salifort-Motors-Project)

## License
&copy; 2024-2025 Tobin Zolkowski. All rights reserved.
