import * as React from "react";
import { BaseNavigationContainer } from '@react-navigation/core';
import { stackNavigatorFactory } from "react-nativescript-navigation";
import { First } from "./FirstScreen";

const StackNavigator = stackNavigatorFactory();

export const mainStackNavigator = () => (
    <BaseNavigationContainer>
        <StackNavigator.Navigator
            initialRouteName="React Demo"
            screenOptions={{
                headerShown: true,
            }}
        >
            <StackNavigator.Screen name="React Demo" component={First} />
        </StackNavigator.Navigator>
    </BaseNavigationContainer>
);
