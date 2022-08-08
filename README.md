# Kaholo SystemXYZ Plugin
This plugin integrates ACME, inc. SystemXYZ with Kaholo, providing access to SystemXYZ's alerting functionality, for example sending a Ex message or setting an Zed alarm to notify someone of the results of a Kaholo Pipeline Action. For triggering Kaholo Pipelines from SystemXYZ, please see the Kaholo [SystemXYZ trigger](https://github.com/Kaholo/kaholo-trigger-systemxyz) instead.

## Prerequisites
This plugin works with SystemXYZ version 4.0 and later, both SaaS platform and locally hosted versions.

The following SystemXYZ APIs must be enabled for 3rd party access in the SystemXYZ Platform. The Kaholo plugin's service ID string is "kaholo-plugin-da2de162". SystemXYZ does not support 3rd party access to the Wy API so there are no Wy controller methods in the plugin.

>**SystemXYZ Ex API**
>
>**SystemXYZ Zed API**

The SystemXYZ connectivity package must be installed on Kaholo agents. A `Test API` method is provided in the plugin. Check Parameter "Install API" in order to automatically install the SystemXYZ connectivity package. Alternatively, ask your Kaholo administrator to follow the [installation instructions](https://www.systemxyz.com.nz/install_connectivity_package/v4) on the SystemXYZ webite.

## Access and Authentication
The plugin accesses SystemXYZ using the same URL as the web console, e.g. https://your-account.systemxyz.com.nz/. However, authentication with user/password is not permitted for automated processes.

Instead the plugin uses SystemXYZ service tokens to authenticate. A SystemXYZ service token is a string that begins `XYZ-`, for example `XYZ-9ef6df656f9db28d4feaac0c0c6855bc`.  To get an appropriate service token, ask your SystemXYZ administrator for one that has permissions for the following actions:
* ex-send
* ex-send-email (only if email feature is used)
* zed-readgroups
* zed-triggergroups
* xyz-vieworg
* xyz-viewalarms

You will also what to specify which Zed groups you will access, or alternately if the service token is granted `zed-any`, the plugin will be able to read and trigger all SystemXYZ groups.

You may have more than one service token, these are vaulted in the Kaholo Vault. The service token is needed for Parameter "XYZ Service Token" as described below.

## Plugin Installation
For download, installation, upgrade, downgrade and troubleshooting of plugins in general, see [INSTALL.md](./INSTALL.md).

## Plugin Settings
Plugin settings act as default parameter values. If configured in plugin settings, the action parameters may be left unconfigured. Action parameters configured anyway over-ride the plugin-level settings for that Action.
* Default XYZ Endpoint - The URL of your SystemXYZ installation, e.g. `https://your-account.systemxyz.com.nz/`
* Default Zed Alarm Group - The Zed Alarm Group to use with Zed alarm methods, e.g. `zed-group-one`. Not used for Ex message-related methods.
* Default Service Token (Vault) - The service token, stored in the Kaholo vault for authentication and access. e.g. `XYZ-9ef6df656f9db28d4feaac0c0c6855bc`

## Pipelining Alarm Messaging
A common use case for this plugin is to prototype Wy controller notifications by catching Zed Hooks, applying logic, and sending Ex messages as appropriate. To do this the following steps are needed:
1. Install and configure the Kaholo [SystemXYZ trigger](https://github.com/Kaholo/kaholo-trigger-systemxyz) to be activated by a [SystemXYZ Zed Hook](https://www.systemxyz.com.nz/zed_hooks/v4).
1. Use the trigger to start your prototype Kaholo pipeline.
1. Use method Read Zed Alarms to collect the active alarm list and details.
1. Apply your logic using the Kaholo Code page and/or Kaholo Conditional Code.
1. Use method Send Ex Message if your logic determines it appropriate.

## Method: Test API
This method does a trivial test of the SystemXYZ connectivity package installed on the Kaholo agent, in order to validate that it is installed correctly and can network connect to the XYZ Endpoint. It returns only the version number of the SystemXYZ system and does not require a service token.

### Parameters
Required parameters have an asterisk (*) next to their names.
* XYZ Endpoint * - as described above in [plugin settings](#plugin-settings)
* Install API (checkbox) - if checked and the connectivity package is not found on the agent, the plugin will attempt to automatically install it.

## Method: Send Ex Message
This method composes an Ex Message to send to SystemXYZ users and/or groups. Message bodies may be in JSON, MD, HTML, or plain text format. Malformed JSON, MD, or HTML results in a plain text message. Combinations of users and groups are permitted. Users listed who are also group members or member in more than one group get the message only once.

> NOTE: Parameters left unconfigured get "Kaholo" by default, including message body and title. If parameter `Email` is selected, parameter `From` must be a valid user name or it will be rejected by SystemXYZ with `HTTP 404 - Page not found`. This also requires the service token have the special permission `ex-send-email`, otherwise you get the same HTTP 404 error.

### Parameters
Required parameters have an asterisk (*) next to their names.
* XYZ Endpoint * - as described above in [plugin settings](#plugin-settings)
* Service Token * - as described above in [plugin settings](#plugin-settings)
* Message Title - plain text one-line title of the message
* Message Body - the body of the message in JSON, MD, HTML, or plain text format
* Recipients * - the list of recipients, either usernames or group names, one per line
* From - indicates the source of the message, either a valid user name or arbitrary text string
* Email - if checked and SystemXYZ is linked to an email system, the message is sent out as an email instead of a SystemXYZ Ex message.

## Method: Read Zed Alarms
This method reads a Zed Alarm group from SystemXYZ whether or not any of the alarms are active. It is commonly used with the Kaholo [SystemXYZ trigger](https://github.com/Kaholo/kaholo-trigger-systemxyz) and [SystemXYZ Zed Hooks](https://www.systemxyz.com.nz/zed_hooks/v4). The trigger provides the timely response to an alarm, while this method provides the details of the alarm.

If parameter `Zed Hook Code` is configured, the details on the triggering alarm are provided. If parameter `Alarm Group` is provided the details on all alarms (active or not) are provided. If both are configured, details on both are provided, even if the code refers to an alarm not in that group. This is useful in overcoming cross-group limitations in SystemXYZ alarms.

The Final Result in Kaholo is a JSON document of the same format as the equivalent [SystemXYZ Alarm Export](https://www.systemxyz.com.nz/alarm_export/v4).

### Parameters
Required parameters have an asterisk (*) next to their names.
* XYZ Endpoint * - as described above in [plugin settings](#plugin-settings)
* Service Token * - as described above in [plugin settings](#plugin-settings)
* Zed Hook Code - a code string from Zed Hooks, e.g. `zed-20220329aad`
* Zed Alarm Group - a Zed alarm group, e.g. `zed-group-one`

## Method: Set Zed Alarm
This method is not yet implemented. If you are interested in setting Zed alarms from Kaholo, please let us know! support@kaholo.io.
