/**
 * City & Neighborhood Ecosystem System
 * Manages neighborhood districts, dynamic eco-footprints (Green vs Industrial),
 * crime safety ratings, property valuations, and weekly city council policy ballots.
 */

export interface CityDistrict {
  id: 'willow_creek' | 'oasis_springs' | 'newcrest_heights';
  name: string;
  description: string;
  icon: string;
  ecoFootprint: number; // -100 (Industrial) to +100 (Green Utopia)
  safetyScore: number; // 0 to 100
  happinessIndex: number; // 0 to 100
  averagePropertyValue: number;
}

export interface CityPolicy {
  id: string;
  title: string;
  icon: string;
  description: string;
  votes: number;
  isActive: boolean;
  effectDescription: string;
}

export class CityEcoSystem {
  public activeDistrictId: 'willow_creek' | 'oasis_springs' | 'newcrest_heights' = 'willow_creek';

  public districts: Record<string, CityDistrict> = {
    willow_creek: {
      id: 'willow_creek',
      name: 'Willow Creek',
      description: 'Idyllisches Gartenviertel mit üppigen Parks, Flussufern und sauberer Natur.',
      icon: '🌳',
      ecoFootprint: 65,
      safetyScore: 92,
      happinessIndex: 88,
      averagePropertyValue: 45000
    },
    oasis_springs: {
      id: 'oasis_springs',
      name: 'Oasis Springs',
      description: 'Sonniges Wüstenparadies mit Palmen, Pools und lebendigen Marktplätzen.',
      icon: '🏜️',
      ecoFootprint: 35,
      safetyScore: 80,
      happinessIndex: 82,
      averagePropertyValue: 38000
    },
    newcrest_heights: {
      id: 'newcrest_heights',
      name: 'Newcrest Heights',
      description: 'Moderne Hochhaus-Metropole mit pulsierender Startup-Kultur und Technologie.',
      icon: '🏙️',
      ecoFootprint: 10,
      safetyScore: 74,
      happinessIndex: 85,
      averagePropertyValue: 62000
    }
  };

  public policies: CityPolicy[] = [
    {
      id: 'green_energy',
      title: 'Ökostrom & Solar-Förderung',
      icon: '🌱',
      description: 'Subventionierung privater Solarpanels und Reduzierung der wöchentlichen Stromkosten.',
      votes: 142,
      isActive: true,
      effectDescription: '40% Rabatt auf wöchentliche Stromrechnungen & +15 Öko-Bonus.'
    },
    {
      id: 'neighborhood_watch',
      title: 'Bürgerwehr & Nachbarschafts-Wache',
      icon: '🛡️',
      description: 'Freiwillige Streifendienste zur Eliminierung von Einbrüchen und Vandalismus.',
      votes: 118,
      isActive: true,
      effectDescription: 'Einbruchsrisiko auf 0% gesenkt & +10 Sicherheits-Score.'
    },
    {
      id: 'tech_grant',
      title: 'Digital- & Startup-Förderprogramm',
      icon: '💻',
      description: 'Städtischer Innovationsfonds für Tech-Geeks, Programmierer und Erfinder.',
      votes: 95,
      isActive: false,
      effectDescription: '+50% schnellerer Skill-Aufstieg in Programmieren & Logik.'
    },
    {
      id: 'tax_relief',
      title: 'Mittelstands-Steuersenkung',
      icon: '🪙',
      description: 'Senkung der Gewerbesteuer zur Ankurbelung lokaler Geschäfte und Aktienrenditen.',
      votes: 84,
      isActive: false,
      effectDescription: '+20% höhere Gewinne im Einzelhandel & Markt-Dividenden.'
    },
    {
      id: 'arts_culture',
      title: 'Kultur- & Künstlerstipendium',
      icon: '🎨',
      description: 'Kulturelle Fördergelder für Straßenmusiker, Maler und Autoren.',
      votes: 102,
      isActive: false,
      effectDescription: '+50% höhere Verkaufserlöse für Gemälde und Band-Gigs.'
    }
  ];

  public getActiveDistrict(): CityDistrict {
    return this.districts[this.activeDistrictId] || this.districts.willow_creek;
  }

  public setDistrict(id: 'willow_creek' | 'oasis_springs' | 'newcrest_heights'): void {
    if (this.districts[id]) {
      this.activeDistrictId = id;
    }
  }

  public castVote(policyId: string): boolean {
    const policy = this.policies.find(p => p.id === policyId);
    if (!policy) return false;

    policy.votes += 1;
    // Re-evaluate active top 3 policies based on votes
    const sorted = [...this.policies].sort((a, b) => b.votes - a.votes);
    this.policies.forEach(p => {
      p.isActive = sorted.slice(0, 2).some(top => top.id === p.id);
    });

    // Update district metrics
    const district = this.getActiveDistrict();
    if (policyId === 'green_energy') district.ecoFootprint = Math.min(100, district.ecoFootprint + 5);
    if (policyId === 'neighborhood_watch') district.safetyScore = Math.min(100, district.safetyScore + 3);
    district.happinessIndex = Math.min(100, district.happinessIndex + 2);

    return true;
  }

  public isPolicyActive(policyId: string): boolean {
    const policy = this.policies.find(p => p.id === policyId);
    return policy ? policy.isActive : false;
  }

  public exportData(): Record<string, any> {
    return {
      activeDistrictId: this.activeDistrictId,
      districts: this.districts,
      policies: this.policies
    };
  }

  public importData(data: Record<string, any>): void {
    if (!data) return;
    if (data.activeDistrictId) this.activeDistrictId = data.activeDistrictId;
    if (data.districts) this.districts = data.districts;
    if (data.policies) this.policies = data.policies;
  }
}
