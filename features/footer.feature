
Feature: SalesPulse Footer Links

  Background:
    Given I am logged in to SalesPulse

  @TC-012
  Scenario: Verify footer contains 25 links
    Then the footer should contain 25 links

  @TC-013
  Scenario: Verify all footer links can be opened
    When I open each footer link
    Then each footer link should open successfully