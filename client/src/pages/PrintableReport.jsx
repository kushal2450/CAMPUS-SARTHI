const formatNumber = (num) => num?.toLocaleString() ?? 'N/A';

const PrintableReport = ({ report }) => {
    if (!report) return null;

    const {
        placementDrive, participantCount, interviewCount, offersMade, studentsPlaced, startDate, endDate, summary,
    } = report;

    return (
        <div style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#1f2937', padding: '40px', backgroundColor: '#ffffff' }}>
            
            {/* Header */}
            <div style={{ borderBottom: '2px solid #4f46e5', paddingBottom: '20px', marginBottom: '30px' }}>
                <h1 style={{ textAlign: 'center', margin: '0 0 10px 0', color: '#312e81', fontSize: '28px' }}>Official Placement Report</h1>
                <p style={{ textAlign: 'center', margin: 0, color: '#6b7280', fontSize: '14px' }}>
                    Generated on {new Date().toLocaleDateString()}
                </p>
            </div>

            {/* Core Data */}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '40px', fontSize: '15px' }}>
                <tbody>
                    <tr>
                        <td style={{ padding: '12px 0', borderBottom: '1px solid #e5e7eb', width: '40%', fontWeight: 'bold' }}>Placement Drive:</td>
                        <td style={{ padding: '12px 0', borderBottom: '1px solid #e5e7eb' }}>{placementDrive?.title || 'N/A'}</td>
                    </tr>
                    <tr>
                        <td style={{ padding: '12px 0', borderBottom: '1px solid #e5e7eb', fontWeight: 'bold' }}>Company Partner:</td>
                        <td style={{ padding: '12px 0', borderBottom: '1px solid #e5e7eb' }}>{placementDrive?.companyName || 'N/A'}</td>
                    </tr>
                    <tr>
                        <td style={{ padding: '12px 0', borderBottom: '1px solid #e5e7eb', fontWeight: 'bold' }}>Drive Period:</td>
                        <td style={{ padding: '12px 0', borderBottom: '1px solid #e5e7eb' }}>
                            {startDate ? new Date(startDate).toLocaleDateString() : 'N/A'} - {endDate ? new Date(endDate).toLocaleDateString() : 'N/A'}
                        </td>
                    </tr>
                </tbody>
            </table>

            {/* Metrics Grid */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px' }}>
                <div style={{ width: '22%', textAlign: 'center', backgroundColor: '#f8fafc', padding: '15px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '12px', textTransform: 'uppercase', color: '#64748b', fontWeight: 'bold', marginBottom: '5px' }}>Participants</div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#4f46e5' }}>{formatNumber(participantCount)}</div>
                </div>
                <div style={{ width: '22%', textAlign: 'center', backgroundColor: '#f8fafc', padding: '15px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '12px', textTransform: 'uppercase', color: '#64748b', fontWeight: 'bold', marginBottom: '5px' }}>Interviews</div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#4f46e5' }}>{formatNumber(interviewCount)}</div>
                </div>
                <div style={{ width: '22%', textAlign: 'center', backgroundColor: '#f8fafc', padding: '15px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '12px', textTransform: 'uppercase', color: '#64748b', fontWeight: 'bold', marginBottom: '5px' }}>Offers Made</div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#4f46e5' }}>{formatNumber(offersMade)}</div>
                </div>
                <div style={{ width: '22%', textAlign: 'center', backgroundColor: '#f8fafc', padding: '15px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '12px', textTransform: 'uppercase', color: '#64748b', fontWeight: 'bold', marginBottom: '5px' }}>Total Placed</div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>{formatNumber(studentsPlaced)}</div>
                </div>
            </div>

            {/* Summary */}
            {summary && (
                <div>
                    <h2 style={{ color: '#312e81', fontSize: '20px', borderBottom: '1px solid #e5e7eb', paddingBottom: '8px', marginBottom: '15px' }}>Executive Summary</h2>
                    <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', color: '#4b5563', fontSize: '14px', margin: 0 }}>
                        {summary}
                    </p>
                </div>
            )}
        </div>
    );
};

export default PrintableReport;