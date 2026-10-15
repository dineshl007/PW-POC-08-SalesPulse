Feature: SalesPulse Pipeline

  Background:
    Given I am logged in to SalesPulse
    When I open the Pipeline page

  @TC-005
  Scenario: Verify all pipeline stages are displayed
    Then I should see the following pipeline stages
      | Stage       |
      | Qualified   |
      | Proposal    |
      | Negotiation |
      | Won         |
      | Lost        |

  @TC-006
  Scenario: Move Soylent Foods to Proposal and verify persistence
    When I move the deal "Soylent Foods" to "Proposal"
    Then the deal "Soylent Foods" should appear in the "Proposal" stage
    And the pipeline stage totals should be calculated correctly
    When I refresh the Pipeline page
    Then the deal "Soylent Foods" should appear in the "Proposal" stage

  @TC-007
  Scenario: Move Tyrell Robotics to Negotiation and verify persistence
    When I move the deal "Tyrell Robotics" to "Negotiation"
    Then the deal "Tyrell Robotics" should appear in the "Negotiation" stage
    And the pipeline stage totals should be calculated correctly
    When I refresh the Pipeline page
    Then the deal "Tyrell Robotics" should appear in the "Negotiation" stage

  @TC-008
  Scenario: Move Umbrella Health to Won and verify persistence
    When I move the deal "Umbrella Health" to "Won"
    Then the deal "Umbrella Health" should appear in the "Won" stage
    And the pipeline stage totals should be calculated correctly
    When I refresh the Pipeline page
    Then the deal "Umbrella Health" should appear in the "Won" stage