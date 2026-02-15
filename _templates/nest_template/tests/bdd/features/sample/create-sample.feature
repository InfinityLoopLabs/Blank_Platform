Feature: Create sample
  As a client
  I want to create an sample
  So that the system persists domain-valid sample

  Scenario: Create sample successfully
    Given the sample endpoint is available
    When a valid sample request is submitted
    Then the response status is 201

  Scenario: Validation failure for invalid total
    Given the sample endpoint is available
    When an sample request is submitted with totalCents set to 0
    Then the response status is 400

  Scenario: Auth failure
    Given the endpoint requires authentication
    When a request is sent without credentials
    Then the response status is 401

  Scenario: Policy denial
    Given the endpoint requires sample:create policy
    When an authenticated user misses this policy
    Then the response status is 403
