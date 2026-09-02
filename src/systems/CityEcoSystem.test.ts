import { describe, it, expect, beforeEach } from 'vitest';
import { CityEcoSystem } from './CityEcoSystem';

describe('CityEcoSystem', () => {
  let city: CityEcoSystem;

  beforeEach(() => {
    city = new CityEcoSystem();
  });

  it('should initialize with default districts and active policies', () => {
    expect(city.districts.willow_creek).toBeDefined();
    expect(city.districts.oasis_springs).toBeDefined();
    expect(city.districts.newcrest_heights).toBeDefined();
    expect(city.isPolicyActive('green_energy')).toBe(true);
  });

  it('should allow switching districts and casting votes', () => {
    city.setDistrict('oasis_springs');
    expect(city.getActiveDistrict().name).toBe('Oasis Springs');

    const initialVotes = city.policies.find(p => p.id === 'tech_grant')!.votes;
    const voted = city.castVote('tech_grant');
    expect(voted).toBe(true);
    expect(city.policies.find(p => p.id === 'tech_grant')!.votes).toBe(initialVotes + 1);
  });

  it('should export and import system data cleanly', () => {
    city.setDistrict('newcrest_heights');
    city.castVote('green_energy');

    const exported = city.exportData();
    const newCity = new CityEcoSystem();
    newCity.importData(exported);

    expect(newCity.activeDistrictId).toBe('newcrest_heights');
    expect(newCity.getActiveDistrict().ecoFootprint).toBe(city.getActiveDistrict().ecoFootprint);
  });
});
