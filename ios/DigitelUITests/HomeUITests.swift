//
//  DigitelUITests.swift
//  DigitelUITests
//
//  Created by anhtu on 6/13/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

import XCTest

class HomeUITests: XCTestCase {

    let app = XCUIApplication();
    
    override func setUp() {
        super.setUp()
        continueAfterFailure = false
        setupSnapshot(app)
        app.launch()
        BaseTestCase.check_to_logout()
        BaseTestCase.login()
    }
    
    override func tearDown() {
        BaseTestCase.logout()
        super.tearDown()
    }
    

//  temp cmt
//    func test_dsa_bad_load() {
//        check_to_logout()
//        login(username: AppAcc.das.username,
//              pass: AppAcc.das.pass)
//        let badloan = app.otherElements["test_badloanlist"]
//        XCTAssertTrue(badloan.waitForExistence(timeout: 10))
//        snapshot("dsa_bad_load")
//
//        logout()
//    }

    func test_world_cup() {
        let event = app.otherElements["promotion_control"]
        XCTAssertTrue(event.waitForExistence(timeout: 10))
        event.tap()
        sleep(10)
        snapshot("world_cup")
        BaseTestCase.back()
    }
    
    func test_home() {

        let test_home_scroll = app.otherElements["test_home_scroll"].firstMatch
        XCTAssertTrue(test_home_scroll.waitForExistence(timeout: 10))
        
        let test_sub_control  = app.otherElements["test_sub_control"]
        XCTAssertTrue(test_sub_control.waitForExistence(timeout: 2))
        snapshot("test_sub_control")
        
        // scroll bottom - top
        test_home_scroll.swipeUp()
        snapshot("test_sub_control_2")
        test_home_scroll.swipeDown()
        sleep(1)

        // move to shop
        app.otherElements["test_home_tab_1"].tap()
        sleep(1)
        snapshot("shop")
        
        // move to knowledge
        app.otherElements["test_home_tab_2"].firstMatch.tap()
        sleep(1)
        snapshot("knowledge")
        
        // move to news
        app.otherElements["test_home_tab_3"].firstMatch.tap()
        sleep(1)
        snapshot("news")
        
        // move to inbox
        app.otherElements["test_inbox_home"].tap()
        sleep(1)
        snapshot("test_inbox_home")
        BaseTestCase.back()

        // move to mail
        app.otherElements["test_mail_home"].tap()
        sleep(1)
        snapshot("test_mail_home")
        BaseTestCase.back()

        // move to money
        app.otherElements["test_home_money"].tap()
        sleep(5)
        snapshot("test_home_money")
        BaseTestCase.back()

        // move to point
        app.otherElements["test_home_point"].tap()
        sleep(5)
        snapshot("test_home_point")
        BaseTestCase.back()

    }
}
