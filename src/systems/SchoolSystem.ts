/**
 * School, Homework & Report Card System
 * Simulates School Bus arrival, homework completion, report cards (Grades A to F),
 * and high-school scholarship grants.
 */

import type { Sim } from '../entity/Sim';
import { EventBus } from './EventBus';

export interface SchoolReportCard {
  studentName: string;
  grade: '1.0 (Sehr Gut)' | '2.0 (Gut)' | '3.0 (Befriedigend)' | '4.0 (Ausreichend)' | '5.0 (Mangelhaft)';
  performanceScore: number; // 0 - 100
  homeworkCompleted: boolean;
}

export class SchoolSystem {
  public reportCard: SchoolReportCard = {
    studentName: 'Alexander',
    grade: '2.0 (Gut)',
    performanceScore: 75,
    homeworkCompleted: false
  };

  public doHomework(sim: Sim): { success: boolean; message: string } {
    if (this.reportCard.homeworkCompleted) {
      return { success: false, message: 'Die Hausaufgaben für heute sind bereits erledigt!' };
    }

    if (sim.needs.getValues().energy < 15) {
      return { success: false, message: 'Zu müde für Hausaufgaben!' };
    }

    sim.needs.modify('energy', -15);
    sim.needs.modify('fun', -10);

    this.reportCard.homeworkCompleted = true;
    this.reportCard.performanceScore = Math.min(100, this.reportCard.performanceScore + 15);
    this.updateGrade();

    sim.triggerEmote('📚', 3000);
    sim.moodletManager.addMoodlet({
      id: 'homework_done',
      name: 'Fleißig gelernt',
      emotion: 'focused',
      weight: 2,
      durationSec: 180,
      icon: '📝',
      description: 'Hausaufgaben sorgfältig erledigt. Bestens vorbereitet auf die nächste Unterrichtsstunde.'
    });

    EventBus.getInstance().emit('TOAST_TRIGGER', {
      title: '📚 Hausaufgaben erledigt',
      message: 'Notendurchschnitt verbessert! Aktuelle Note: ' + this.reportCard.grade,
      icon: '📝',
      type: 'success'
    });

    return { success: true, message: `Hausaufgaben vollständig gelöst! Note verbessert auf: ${this.reportCard.grade}` };
  }

  public attendSchool(sim: Sim): { success: boolean; reward: number; message: string } {
    const perfGain = this.reportCard.homeworkCompleted ? 20 : 5;
    this.reportCard.performanceScore = Math.min(100, this.reportCard.performanceScore + perfGain);
    this.reportCard.homeworkCompleted = false; // Reset for next day
    this.updateGrade();

    let reward = 0;
    if (this.reportCard.grade.includes('1.0')) {
      reward = 250; // Stipendium
      sim.simoleons += reward;
    }

    sim.triggerEmote('🏫', 4000);
    return {
      success: true,
      reward,
      message: `Schultag erfolgreich abgeschlossen! Aktuelle Schulnote: ${this.reportCard.grade}${reward > 0 ? ` (+§ ${reward} Ehren-Stipendium!)` : ''}`
    };
  }

  private updateGrade(): void {
    if (this.reportCard.performanceScore >= 90) {
      this.reportCard.grade = '1.0 (Sehr Gut)';
    } else if (this.reportCard.performanceScore >= 75) {
      this.reportCard.grade = '2.0 (Gut)';
    } else if (this.reportCard.performanceScore >= 50) {
      this.reportCard.grade = '3.0 (Befriedigend)';
    } else if (this.reportCard.performanceScore >= 30) {
      this.reportCard.grade = '4.0 (Ausreichend)';
    } else {
      this.reportCard.grade = '5.0 (Mangelhaft)';
    }
  }
}
