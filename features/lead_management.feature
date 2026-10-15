Feature: SalesPulse Lead Management

  Background:
    Given I am logged in to SalesPulse
    When I open the Leads page

  @TC-009
  Scenario: Create a lead with unique details
    When I create a lead with unique details
    Then the newly created lead should appear in the leads table

  @TC-010
  Scenario: Prevent creating a lead with an existing email
    When I open the New Lead form
    And I enter lead details with an existing email
    Then the duplicate email validation should be displayed

  @TC-011
  Scenario: View existing lead details
    When I open the lead "Owen Scott"
    Then the lead details page should be displayed

  @TC-015
  Scenario: Validate mandatory Contact Name field
    When I open the New Lead form
    And I capture the current lead count
    And I leave the Contact Name field empty and submit the form
    Then I should see the contact name validation message
    And the lead should not be created

  @TC-019
  Scenario: Verify New Lead modal displays all expected form fields
    When I open the New Lead form
    Then the New Lead modal should be displayed
    And all expected lead form fields should be visible

  @TC-022
  Scenario: Verify saved note appears in activity timeline with timestamp
    When I open the lead "Owen Scott"
    And I add a valid note "Follow-up required for customer"
    Then the saved note should appear in the activity timeline
    And the activity timestamp should be displayed

  @TC-023
  Scenario: Validate note with fewer than five characters
    When I open the lead "Owen Scott"
    And I enter a note with fewer than five characters
    Then the note validation message should be displayed
    And the note should not be saved
