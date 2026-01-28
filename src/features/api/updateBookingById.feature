Feature: Update booking by Id API
    #api
        @onlyThis @all
        Scenario Outline: Test update booking by ID API
            Given I use a session with a "admin" profile using the API
            When I update the booking "<id>" with the following data:
                | lastname  | <newName> |
                | totalprice | <newPrice>    |
            Then the service responds with status code "200"
            And the service responds in less than "1000" ms
            Examples:
              | id  | newName |newPrice|
              | 6   |Luigi|500|
              | 6   |John|111|

        @onlyThis @all
        Scenario Outline: Test update booking by ID and specific parameter API
            Given I use a session with a "admin" profile using the API
            When I update the booking "<id>" changing "<fieldToChange>" to "<newValue>"
            Then the service responds with status code "200"
            And the service responds in less than "1000" ms
            Examples:
              | id  |fieldToChange|newValue|
              | 6   |lastname|Luigi|
              | 6   |lastname|John|

@onlyThis @all
        Scenario: Test update booking by ID and specific parameter API MOCKING
            Given I use a session with a "admin" profile using the API
            And I mock the ".*/booking/.*" service using the file "bookingError"
            When I update the booking "968" changing "firstname" to "John"
            Then the service responds with status code "400"
            And the service responds in less than "1000" ms
