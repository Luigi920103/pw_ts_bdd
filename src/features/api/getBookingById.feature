Feature: Get booking by Id API
    #api
        @test @onlyThis @all
        Scenario Outline: Test get booking by ID API
            When I get a booking by the id "<id>"
            Then the service responds with status code "200"
            And the service responds in less than "1000" ms
            And the name is "<firstName>"
            Examples:
              | id  | firstName |
              | 6   |Eric       |