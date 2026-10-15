Feature: SalesPulse Leads

  Background:
    Given I am logged in to SalesPulse
    When I open the Leads page

  @TC-002 @TC-018
  Scenario: Verify Leads page heading and table contents
    Then I should see the Leads heading
    And the Leads table should display its column headers
    And the Leads table should contain at least one lead

  @TC-003
  Scenario: Search for a lead by name
    When I search for a lead named "Owen Scott"
    Then I should see the matching lead

  @TC-004
  Scenario: Filter leads by status
    When I filter leads by status "Qualified"
    Then I should see only leads with status "Qualified"

  @TC-016
  Scenario: Verify search behavior for a non-existing lead
    When I search for a lead named "ZZZ_NoLead_999"
    Then I should see the no matching leads message

  @TC-020
  Scenario: Bulk-assign a selected lead to an owner
    When I select the lead "Owen Scott" for assignment
    And I assign the selected lead to "Omar Haddad"
    Then the lead "Owen Scott" should be assigned to "Omar Haddad"
    And the assignment success message should be displayed

  @TC-021
  Scenario: Filter leads by source
    When I filter leads by source "Referral"
    Then I should see only leads with source "Referral"

  @TC-024
  Scenario: Verify leads can be filtered by status and source together
    When I filter leads by status "Qualified"
    And I filter leads by source "Referral"
    Then the status filter should be set to "Qualified"
    And the source filter should be set to "Referral"
    And I should see only leads matching status "Qualified" and source "Referral"

  @TC-025
  Scenario: Verify no leads message when combined filters have no matching results
    When I filter leads by status "Contacted"
    And I filter leads by source "Event"
    Then the status filter should be set to "Contacted"
    And the source filter should be set to "Event"
    And I should see the no matching leads message
    And the leads count should be zero

@TC-026
Scenario: Create a lead and convert it to a deal
  When I create a lead with unique details
  Then the newly created lead should appear in the leads table
  When I open the newly created lead
  And I convert the lead to a deal
  Then the lead should show the converted deal banner
  When I open the converted deal in the pipeline
  Then the converted deal should be displayed in the pipeline