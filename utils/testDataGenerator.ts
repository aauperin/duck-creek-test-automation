/**
 * Test Data Generator for Duck Creek
 * Generates realistic test data for policies, claims, customers, etc.
 */

export class TestDataGenerator {

  static randomString(length: number = 10): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  static randomNumber(min: number = 1000, max: number = 9999): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  static randomDate(daysFromNow: number = 0): string {
    const date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    return date.toISOString().split('T')[0];
  }

  static futureDate(daysFromNow: number = 365): string {
    return this.randomDate(daysFromNow);
  }

  static pastDate(daysAgo: number = 30): string {
    return this.randomDate(-daysAgo);
  }

  static generatePolicyNumber(): string {
    return `POL-${this.randomNumber(100000, 999999)}`;
  }

  static generateClaimNumber(): string {
    return `CLM-${this.randomNumber(100000, 999999)}`;
  }

  static generateCustomerData() {
    const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily', 'James', 'Emma', 'Robert', 'Olivia'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];

    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];

    return {
      firstName,
      lastName,
      fullName: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
      phone: this.generatePhoneNumber(),
      dateOfBirth: this.pastDate(Math.floor(Math.random() * 10000) + 6570), // 18-45 years old
      ssn: this.generateSSN(),
    };
  }

  static generatePhoneNumber(): string {
    return `${this.randomNumber(200, 999)}-${this.randomNumber(200, 999)}-${this.randomNumber(1000, 9999)}`;
  }

  static generateSSN(): string {
    return `${this.randomNumber(100, 999)}-${this.randomNumber(10, 99)}-${this.randomNumber(1000, 9999)}`;
  }

  static generateAddress() {
    const streets = ['Main St', 'Oak Ave', 'Maple Dr', 'Cedar Ln', 'Pine Rd', 'Elm St', 'Washington Blvd', 'Park Ave'];
    const cities = ['Springfield', 'Franklin', 'Clinton', 'Georgetown', 'Madison', 'Salem', 'Arlington', 'Bristol'];
    const states = ['CA', 'TX', 'FL', 'NY', 'PA', 'IL', 'OH', 'GA', 'NC', 'MI'];

    const state = states[Math.floor(Math.random() * states.length)];

    return {
      street: `${this.randomNumber(100, 9999)} ${streets[Math.floor(Math.random() * streets.length)]}`,
      city: cities[Math.floor(Math.random() * cities.length)],
      state,
      zip: this.randomNumber(10000, 99999).toString(),
      country: 'USA',
    };
  }

  static generatePolicyData() {
    const policyTypes = ['Auto', 'Home', 'Life', 'Commercial', 'Umbrella'];
    const coverageTypes = ['Liability', 'Comprehensive', 'Collision', 'Personal Injury'];

    return {
      policyNumber: this.generatePolicyNumber(),
      policyType: policyTypes[Math.floor(Math.random() * policyTypes.length)],
      effectiveDate: this.futureDate(1),
      expirationDate: this.futureDate(366),
      premium: this.randomNumber(500, 5000),
      coverageType: coverageTypes[Math.floor(Math.random() * coverageTypes.length)],
      coverageAmount: this.randomNumber(50000, 1000000),
      deductible: this.randomNumber(250, 2500),
      customer: this.generateCustomerData(),
      address: this.generateAddress(),
    };
  }

  static generateClaimData() {
    const lossTypes = ['Theft', 'Fire', 'Water Damage', 'Vandalism', 'Accident', 'Weather'];
    const claimStatuses = ['Open', 'Pending', 'Under Review', 'Approved', 'Denied', 'Closed'];

    return {
      claimNumber: this.generateClaimNumber(),
      policyNumber: this.generatePolicyNumber(),
      lossDate: this.pastDate(Math.floor(Math.random() * 60)),
      reportDate: this.pastDate(Math.floor(Math.random() * 30)),
      lossType: lossTypes[Math.floor(Math.random() * lossTypes.length)],
      lossDescription: 'Test claim description for automated testing',
      estimatedAmount: this.randomNumber(1000, 50000),
      status: claimStatuses[Math.floor(Math.random() * claimStatuses.length)],
      claimant: this.generateCustomerData(),
    };
  }

  static generateEndorsementData() {
    const endorsementTypes = ['Address Change', 'Coverage Increase', 'Add Driver', 'Remove Vehicle', 'Update Limits'];

    return {
      policyNumber: this.generatePolicyNumber(),
      endorsementType: endorsementTypes[Math.floor(Math.random() * endorsementTypes.length)],
      effectiveDate: this.futureDate(1),
      reason: 'Test endorsement for automated testing',
      premiumChange: this.randomNumber(-500, 500),
    };
  }

  static generateBillingData() {
    const paymentMethods = ['Credit Card', 'Debit Card', 'ACH', 'Check', 'Wire Transfer'];
    const frequencies = ['Monthly', 'Quarterly', 'Semi-Annual', 'Annual'];

    return {
      policyNumber: this.generatePolicyNumber(),
      paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
      frequency: frequencies[Math.floor(Math.random() * frequencies.length)],
      amount: this.randomNumber(100, 1000),
      dueDate: this.futureDate(30),
      accountNumber: this.randomNumber(1000000000, 9999999999).toString(),
    };
  }

  /**
   * Generate a batch of test data
   */
  static generateBatch(type: 'policy' | 'claim' | 'customer', count: number = 10) {
    const results = [];

    for (let i = 0; i < count; i++) {
      switch (type) {
        case 'policy':
          results.push(this.generatePolicyData());
          break;
        case 'claim':
          results.push(this.generateClaimData());
          break;
        case 'customer':
          results.push(this.generateCustomerData());
          break;
      }
    }

    return results;
  }

  /**
   * Save generated data to JSON file
   */
  static saveToFile(data: any, filename: string) {
    const fs = require('fs');
    const path = require('path');

    const dir = path.dirname(filename);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(filename, JSON.stringify(data, null, 2));
    console.log(`✓ Test data saved to: ${filename}`);
  }
}

// Example usage
if (require.main === module) {
  console.log('🎲 Generating test data...\n');

  // Generate sample policy data
  const policies = TestDataGenerator.generateBatch('policy', 5);
  TestDataGenerator.saveToFile(policies, './test-data/policies.json');

  // Generate sample claim data
  const claims = TestDataGenerator.generateBatch('claim', 5);
  TestDataGenerator.saveToFile(claims, './test-data/claims.json');

  // Generate sample customer data
  const customers = TestDataGenerator.generateBatch('customer', 10);
  TestDataGenerator.saveToFile(customers, './test-data/customers.json');

  console.log('\n✅ Test data generation complete!');
  console.log('📁 Files saved to: test-data/');
}
