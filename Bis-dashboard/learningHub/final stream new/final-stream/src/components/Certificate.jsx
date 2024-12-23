import React from 'react';
import { useParams } from 'react-router-dom';
import { categories } from '../data/categories';
import { jsPDF } from 'jspdf';

function Certificate() {
  const { categoryId } = useParams();
  const category = categories.find(c => c.id === parseInt(categoryId));

  if (!category || category.progress !== 100) {
    return <div>Certificate not available</div>;
  }

  const generateCertificate = () => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    // Add certificate styling
    doc.setFillColor(240, 240, 240);
    doc.rect(0, 0, 297, 210, 'F');
    
    // Add border
    doc.setDrawColor(0, 0, 139);
    doc.setLineWidth(1);
    doc.rect(10, 10, 277, 190);

    // Add header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(30);
    doc.setTextColor(0, 0, 139);
    doc.text('Certificate of Achievement', 148.5, 40, { align: 'center' });

    // Add content
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('This is to certify that the learner has successfully completed', 148.5, 80, { align: 'center' });
    doc.setFontSize(24);
    doc.text(category.title, 148.5, 100, { align: 'center' });
    
    // Add date
    const date = new Date().toLocaleDateString();
    doc.setFontSize(14);
    doc.text(`Issued on: ${date}`, 148.5, 140, { align: 'center' });

    // Add BIS logo placeholder
    doc.setFontSize(12);
    doc.text('Bureau of Indian Standards', 148.5, 170, { align: 'center' });

    // Save the PDF
    doc.save(`BIS_Certificate_${category.title.replace(/\s+/g, '_')}.pdf`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Congratulations!
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          You have successfully completed the {category.title} course!
        </p>
        <button
          onClick={generateCertificate}
          className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300"
        >
          Download Certificate
        </button>
      </div>
    </div>
  );
}

export default Certificate;