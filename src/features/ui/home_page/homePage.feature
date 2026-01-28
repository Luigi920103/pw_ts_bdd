Feature: basic test ui on home page

@debugUi @all
    Scenario: add a product to cart from home page
        Given I visit the home page
        When I add to car a "MacBook" from home page
        Then I should see a success alert with message "Success: You have added MacBook to your shopping cart!"

@debugUi @all
    Scenario: check Ui changes
        When I visit the home page
        Then I check the "home" page to see if there is any change to the previous version of the UI "homePage.png"