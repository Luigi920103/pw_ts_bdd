Feature: Login API
    #api
        @positiveApiTesting @apiTesting @apiDebug @onlyThis @all
        Scenario: Test authentication API with valid credentials
            When I login with a "admin" profile using the API
            Then the service responds with status code "200"
            And the service responds with the schema "loginSchema"
            And the service responds in less than "1000" ms
