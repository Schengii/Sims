/**
 * Education & University System
 * Manages school grades for kids/teens and university degree programs for young adults/adults.
 */

export interface DegreeProgram {
  id: string;
  name: string;
  icon: string;
  tuitionFee: number;
  careerBoost: string;
  description: string;
}

export const DEGREE_PROGRAMS: Record<string, DegreeProgram> = {
  computer_science: {
    id: 'computer_science',
    name: 'Informatik & KI (B.Sc.)',
    icon: '💻',
    tuitionFee: 1200,
    careerBoost: 'tech_guru',
    description: 'Startet Tech-Guru Karriere direkt auf Stufe 3 mit 30% Gehaltsbonus.'
  },
  culinary_arts: {
    id: 'culinary_arts',
    name: 'Gourmet-Kochkunst (M.A.)',
    icon: '🍳',
    tuitionFee: 1000,
    careerBoost: 'gourmet_chef',
    description: 'Startet Gourmet-Chef Karriere auf Stufe 3 und schaltet Meisterrezepte frei.'
  },
  fine_arts: {
    id: 'fine_arts',
    name: 'Bildende Kunst & Design',
    icon: '🎨',
    tuitionFee: 900,
    careerBoost: 'artist',
    description: 'Startet Künstler-Karriere auf Stufe 3 und erhöht Gemäldewerte.'
  }
};

export class EducationManager {
  public grade: number = 2.0; // German grading scale (1.0 best, 6.0 worst)
  public homeworkDone: boolean = false;
  public enrolledDegree?: string;
  public degreeProgress: number = 0; // 0 to 100%
  public completedDegrees: string[] = [];

  public doHomework(): string {
    this.homeworkDone = true;
    this.grade = Math.max(1.0, parseFloat((this.grade - 0.3).toFixed(1)));
    return '📚 Hausaufgaben gewissenhaft erledigt! Schulnote verbessert.';
  }

  public enrollInUniversity(degreeId: string, simoleons: number): { success: boolean; message: string; cost: number } {
    const degree = DEGREE_PROGRAMS[degreeId];
    if (!degree) return { success: false, message: 'Ungültiger Studiengang.', cost: 0 };
    if (simoleons < degree.tuitionFee) return { success: false, message: 'Nicht genug Simoleons für Studiengebühren!', cost: 0 };

    this.enrolledDegree = degreeId;
    this.degreeProgress = 0;
    return { success: true, message: `🎓 Erfolgreich im Studiengang "${degree.name}" eingeschrieben!`, cost: degree.tuitionFee };
  }

  public studyForExam(): string {
    if (!this.enrolledDegree) return 'Du bist aktuell an keiner Universität eingeschrieben.';
    this.degreeProgress += 25;
    if (this.degreeProgress >= 100) {
      const degree = DEGREE_PROGRAMS[this.enrolledDegree];
      this.completedDegrees.push(this.enrolledDegree);
      const degreeName = degree ? degree.name : this.enrolledDegree;
      this.enrolledDegree = undefined;
      this.degreeProgress = 0;
      return `🎉 HERZLICHEN GLÜCKWUNSCH! Du hast dein Studium "${degreeName}" erfolgreich abgeschlossen!`;
    }
    return `📖 Fleißig gelernt! Studienfortschritt: ${this.degreeProgress}%`;
  }
}
