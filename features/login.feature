Feature: SalesPulse Login

  @TC-001
  Scenario: Login with valid credentials
    Given I am on the SalesPulse login page
    When I sign in with valid credentials
    Then I should be redirected to the CRM dashboard
    And I should see the dashboard welcome heading

  @TC-014
  Scenario: Login with invalid credentials
    Given I am on the SalesPulse login page
    When I sign in with invalid credentials
    Then I should see the login error message
    And I should remain on the login page

  @TC-017
  Scenario: Submit login form with empty username and password
    Given I am on the SalesPulse login page
    When I submit the login form with empty credentials
    Then I should see the login error message
    And I should remain on the login page
