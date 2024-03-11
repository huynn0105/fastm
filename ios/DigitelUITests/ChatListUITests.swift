//
//  ChatListUITests.swift
//  DigitelUITests
//
//  Created by anhtu on 6/21/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

import XCTest

class ChatListUITests: XCTestCase {
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
        super.tearDown()
    }
    
    func test_contactlist() {
        let tabbar = app.otherElements["test_tabbar_chatlist"]
        XCTAssertTrue(tabbar.waitForExistence(timeout: 15))
        tabbar.tap()
        
        // chatlist is visible
        let contactlist = app.otherElements["test_chatlist"]
        XCTAssertTrue(contactlist.waitForExistence(timeout: 8))
        snapshot("test_chatlist")
        
        // move to chat
        app.otherElements["test_row_chat_0"].tap()
        sleep(8)
        snapshot("test_row_chat_0")
        BaseTestCase.back()
        
        // move to chat group
        app.otherElements["animated_tab_1"].tap()
        sleep(3)
        snapshot("test_chatlist_group")
        
        // move to create group
        app.otherElements["test_create_group_btn"].tap()
        sleep(3)
        snapshot("test_create_group_btn")
        
        sleep(3)
    }
}
