"use client";

import { useState } from 'react';
import ReportModal from './components/ReportModal';
import { generateGeneralReport } from './services/reportService';
import InventoryManager from '../Inventory';
//import "@/app/admin/app/Inventory/Inventory-see/";  // Adjust the path accordingly

export default function InventoryPage() {
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    // const [loading, setLoading] = useState(false);

    const handleGenerateGeneralReport = async () => {
        try {
            // setLoading(true);
            // Generate the HTML report content
            const htmlContent = await generateGeneralReport();

            // Create a blob with HTML content
            const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });

            // Create download link
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `inventory-report-${new Date().toISOString().split('T')[0]}.html`;

            // Trigger download
            document.body.appendChild(a);
            a.click();

            // Cleanup
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            setIsReportModalOpen(false);
        } catch (error) {
            console.error('Error generating report:', error);
            alert('Failed to generate report. Please try again.');
        } finally {
            // setLoading(false);
        }
    };

    const handleGenerateSmartReport = () => {
        alert('Smart report generation will be implemented soon!');
        setIsReportModalOpen(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
            <div className="max-w-7xl mx-auto">
                <InventoryManager />

                <ReportModal
                    isOpen={isReportModalOpen}
                    onClose={() => setIsReportModalOpen(false)}
                    onGenerateGeneralReport={handleGenerateGeneralReport}
                    onGenerateSmartReport={handleGenerateSmartReport}
                />
            </div>
        </div>
    );
}