import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import type { WeeklyReport } from '../../shared/types.js';

export const generateRadarData = (equipment: {
  attack?: number;
  defense?: number;
  magicAttack?: number;
  magicDefense?: number;
  health?: number;
  speed?: number;
}) => {
  return [
    { subject: '攻击', A: equipment.attack || 0, fullMark: 100 },
    { subject: '防御', A: equipment.defense || 0, fullMark: 100 },
    { subject: '魔攻', A: equipment.magicAttack || 0, fullMark: 100 },
    { subject: '魔防', A: equipment.magicDefense || 0, fullMark: 100 },
    { subject: '生命', A: equipment.health || 0, fullMark: 100 },
    { subject: '速度', A: equipment.speed || 0, fullMark: 100 },
  ];
};

export const generateTrendData = (trend: { date: string; count: number }[]) => {
  return trend.map(item => ({
    name: item.date.slice(5),
    制造数量: item.count,
  }));
};

export const exportPDF = async (
  report: WeeklyReport,
  radarChartRef: React.RefObject<HTMLDivElement>,
  trendChartRef: React.RefObject<HTMLDivElement>
): Promise<void> => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  pdf.setFillColor(28, 28, 40);
  pdf.rect(0, 0, pageWidth, pageHeight, 'F');

  pdf.setTextColor(212, 175, 55);
  pdf.setFontSize(24);
  pdf.text('魔法工坊周报', pageWidth / 2, 20, { align: 'center' });

  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(12);
  pdf.text(`统计周期: ${report.weekStart} ~ ${report.weekEnd}`, pageWidth / 2, 30, { align: 'center' });

  pdf.setTextColor(108, 52, 131);
  pdf.setFontSize(16);
  pdf.text('🏆 本周热门装备', 15, 45);

  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(11);
  pdf.text(`名称: ${report.topEquipment.name}`, 15, 55);
  pdf.text(`评分: ${report.topEquipment.score}`, 15, 62);
  pdf.text(`品质: ${report.topEquipment.quality}/100`, 15, 69);
  pdf.text(`词缀: ${report.topEquipment.affixes.map(a => a.name).join(', ')}`, 15, 76);

  pdf.setTextColor(108, 52, 131);
  pdf.setFontSize(16);
  pdf.text('📊 装备属性分布', 15, 95);

  if (radarChartRef.current) {
    const canvas = await html2canvas(radarChartRef.current, {
      backgroundColor: '#1C1C28',
      scale: 2,
    });
    const imgData = canvas.toDataURL('image/png');
    const imgWidth = 80;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 15, 102, imgWidth, imgHeight);
  }

  pdf.setTextColor(108, 52, 131);
  pdf.setFontSize(16);
  pdf.text('📈 制造趋势', 120, 95);

  if (trendChartRef.current) {
    const canvas = await html2canvas(trendChartRef.current, {
      backgroundColor: '#1C1C28',
      scale: 2,
    });
    const imgData = canvas.toDataURL('image/png');
    const imgWidth = 80;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 120, 102, imgWidth, imgHeight);
  }

  pdf.setTextColor(108, 52, 131);
  pdf.setFontSize(16);
  pdf.text('🎖️ 排行榜 TOP 5', 15, 190);

  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(10);
  pdf.text('排名 | 玩家 | 评分 | 制造数 | 附魔数', 15, 200);

  report.byScore.slice(0, 5).forEach((item, index) => {
    const y = 208 + index * 7;
    pdf.text(
      `${index + 1}. ${item.playerName} | ${item.score} | ${item.craftCount} | ${item.enchantCount}`,
      15,
      y
    );
  });

  pdf.setTextColor(212, 175, 55);
  pdf.setFontSize(10);
  pdf.text('魔法工坊系统 © 2024', pageWidth / 2, pageHeight - 10, { align: 'center' });

  pdf.save(`魔法工坊周报_${report.weekStart}.pdf`);
};
