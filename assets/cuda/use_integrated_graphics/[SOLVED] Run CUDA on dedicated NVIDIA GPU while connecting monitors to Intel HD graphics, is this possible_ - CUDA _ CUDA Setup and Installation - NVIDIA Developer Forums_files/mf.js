define("discourse-mf", ["@messageformat/runtime/messages", "@messageformat/runtime", "@messageformat/runtime/lib/cardinals"], function (_messages, _runtime, _cardinals) {
  "use strict";

  const msgData = {
    en: {
      "about.traffic_info_footer_MF": d => "In the last 6 months, this site has served content to an estimated " + (0, _runtime.plural)(d.total_visitors, 0, _cardinals.en, {
        one: (0, _runtime.number)("en", d.total_visitors, 0) + " people",
        other: (0, _runtime.number)("en", d.total_visitors, 0) + " people"
      }) + " each month, with an estimated " + (0, _runtime.plural)(d.eu_visitors, 0, _cardinals.en, {
        one: (0, _runtime.number)("en", d.eu_visitors, 0) + " people",
        other: (0, _runtime.number)("en", d.eu_visitors, 0) + " people"
      }) + " from the European Union.\n",
      "about.activities.visitors_MF": d => (0, _runtime.plural)(d.total_count, 0, _cardinals.en, {
        one: d.total_formatted_number + " visitor",
        other: d.total_formatted_number + " visitors"
      }) + ", about " + (0, _runtime.plural)(d.eu_count, 0, _cardinals.en, {
        one: d.eu_formatted_number,
        other: d.eu_formatted_number
      }) + " from the EU\n",
      "user.messages.read_more_group_pm_MF": d => (0, _runtime.select)(d.HAS_UNREAD_AND_NEW, {
        true: "\n    " + (0, _runtime.plural)(d.UNREAD, 0, _cardinals.en, {
          "0": "",
          one: "There is <a href=\"" + d.basePath + "/u/" + d.username + "/messages/group/" + d.groupName + "/unread\">" + (0, _runtime.number)("en", d.UNREAD, 0) + " unread</a>",
          other: "There are <a href=\"" + d.basePath + "/u/" + d.username + "/messages/group/" + d.groupName + "/unread\">" + (0, _runtime.number)("en", d.UNREAD, 0) + " unread</a>"
        }) + "\n    " + (0, _runtime.plural)(d.NEW, 0, _cardinals.en, {
          "0": "",
          one: " and <a href=\"" + d.basePath + "/u/" + d.username + "/messages/group/" + d.groupName + "/new\">" + (0, _runtime.number)("en", d.NEW, 0) + " new</a> message remaining, or browse other messages in " + d.groupLink,
          other: " and <a href=\"" + d.basePath + "/u/" + d.username + "/messages/group/" + d.groupName + "/new\">" + (0, _runtime.number)("en", d.NEW, 0) + " new</a> messages remaining, or browse other messages in " + d.groupLink
        }) + "\n  ",
        false: "\n    " + (0, _runtime.plural)(d.UNREAD, 0, _cardinals.en, {
          "0": "",
          one: "There is <a href=\"" + d.basePath + "/u/" + d.username + "/messages/group/" + d.groupName + "/unread\">" + (0, _runtime.number)("en", d.UNREAD, 0) + " unread</a> message remaining, or browse other messages in " + d.groupLink,
          other: "There are <a href=\"" + d.basePath + "/u/" + d.username + "/messages/group/" + d.groupName + "/unread\">" + (0, _runtime.number)("en", d.UNREAD, 0) + " unread</a> messages remaining, or browse other messages in " + d.groupLink
        }) + "\n    " + (0, _runtime.plural)(d.NEW, 0, _cardinals.en, {
          "0": "",
          one: "There is <a href=\"" + d.basePath + "/u/" + d.username + "/messages/group/" + d.groupName + "/new\">" + (0, _runtime.number)("en", d.NEW, 0) + " new</a> message remaining, or browse other messages in " + d.groupLink,
          other: "There are <a href=\"" + d.basePath + "/u/" + d.username + "/messages/group/" + d.groupName + "/new\">" + (0, _runtime.number)("en", d.NEW, 0) + " new</a> messages remaining, or browse other messages in " + d.groupLink
        }) + "\n  ",
        other: ""
      }) + "\n",
      "user.messages.read_more_personal_pm_MF": d => (0, _runtime.select)(d.HAS_UNREAD_AND_NEW, {
        true: "\n    " + (0, _runtime.plural)(d.UNREAD, 0, _cardinals.en, {
          "0": "",
          one: "There is <a href=\"" + d.basePath + "/u/" + d.username + "/messages/unread\">" + (0, _runtime.number)("en", d.UNREAD, 0) + " unread</a>",
          other: "There are <a href=\"" + d.basePath + "/u/" + d.username + "/messages/unread\">" + (0, _runtime.number)("en", d.UNREAD, 0) + " unread</a>"
        }) + "\n    " + (0, _runtime.plural)(d.NEW, 0, _cardinals.en, {
          "0": "",
          one: " and <a href=\"" + d.basePath + "/u/" + d.username + "/messages/new\">" + (0, _runtime.number)("en", d.NEW, 0) + " new</a> message remaining, or browse other <a href=\"" + d.basePath + "/u/" + d.username + "/messages\">personal messages</a>",
          other: " and <a href=\"" + d.basePath + "/u/" + d.username + "/messages/new\">" + (0, _runtime.number)("en", d.NEW, 0) + " new</a> messages remaining, or browse other <a href=\"" + d.basePath + "/u/" + d.username + "/messages\">personal messages</a>"
        }) + "\n  ",
        false: "\n    " + (0, _runtime.plural)(d.UNREAD, 0, _cardinals.en, {
          "0": "",
          one: "There is <a href=\"" + d.basePath + "/u/" + d.username + "/messages/unread\">" + (0, _runtime.number)("en", d.UNREAD, 0) + " unread</a> message remaining, or browse other <a href=\"" + d.basePath + "/u/" + d.username + "/messages\">personal messages</a>",
          other: "There are <a href=\"" + d.basePath + "/u/" + d.username + "/messages/unread\">" + (0, _runtime.number)("en", d.UNREAD, 0) + " unread</a> messages remaining, or browse other <a href=\"" + d.basePath + "/u/" + d.username + "/messages\">personal messages</a>"
        }) + "\n    " + (0, _runtime.plural)(d.NEW, 0, _cardinals.en, {
          "0": "",
          one: "There is <a href=\"" + d.basePath + "/u/" + d.username + "/messages/new\">" + (0, _runtime.number)("en", d.NEW, 0) + " new</a> message remaining, or browse other <a href=\"" + d.basePath + "/u/" + d.username + "/messages\">personal messages</a>",
          other: "There are <a href=\"" + d.basePath + "/u/" + d.username + "/messages/new\">" + (0, _runtime.number)("en", d.NEW, 0) + " new</a> messages remaining, or browse other <a href=\"" + d.basePath + "/u/" + d.username + "/messages\">personal messages</a>"
        }) + "\n  ",
        other: ""
      }) + "\n",
      "user.invited.invite.link_validity_MF": d => "Link is valid for up to " + (0, _runtime.plural)(d.user_count, 0, _cardinals.en, {
        one: (0, _runtime.number)("en", d.user_count, 0) + " user",
        other: (0, _runtime.number)("en", d.user_count, 0) + " users"
      }) + " and expires in " + (0, _runtime.plural)(d.duration_days, 0, _cardinals.en, {
        one: (0, _runtime.number)("en", d.duration_days, 0) + " day",
        other: (0, _runtime.number)("en", d.duration_days, 0) + " days"
      }) + ".\n",
      "logs_error_rate_notice.reached_hour_MF": d => "<b>" + d.relativeAge + "</b> – <a href=\"" + d.url + "\" target=\"_blank\">" + (0, _runtime.plural)(d.rate, 0, _cardinals.en, {
        one: (0, _runtime.number)("en", d.rate, 0) + " error/hour",
        other: (0, _runtime.number)("en", d.rate, 0) + " errors/hour"
      }) + "</a> reached site setting limit of " + (0, _runtime.plural)(d.limit, 0, _cardinals.en, {
        one: (0, _runtime.number)("en", d.limit, 0) + " error/hour",
        other: (0, _runtime.number)("en", d.limit, 0) + " errors/hour"
      }) + ".\n",
      "logs_error_rate_notice.reached_minute_MF": d => "<b>" + d.relativeAge + "</b> – <a href=\"" + d.url + "\" target=\"_blank\">" + (0, _runtime.plural)(d.rate, 0, _cardinals.en, {
        one: (0, _runtime.number)("en", d.rate, 0) + " error/minute",
        other: (0, _runtime.number)("en", d.rate, 0) + " errors/minute"
      }) + "</a> reached site setting limit of " + (0, _runtime.plural)(d.limit, 0, _cardinals.en, {
        one: (0, _runtime.number)("en", d.limit, 0) + " error/minute",
        other: (0, _runtime.number)("en", d.limit, 0) + " errors/minute"
      }) + ".\n",
      "logs_error_rate_notice.exceeded_hour_MF": d => "<b>" + d.relativeAge + "</b> – <a href=\"" + d.url + "\" target=\"_blank\">" + (0, _runtime.plural)(d.rate, 0, _cardinals.en, {
        one: (0, _runtime.number)("en", d.rate, 0) + " error/hour",
        other: (0, _runtime.number)("en", d.rate, 0) + " errors/hour"
      }) + "</a> exceeded site setting limit of " + (0, _runtime.plural)(d.limit, 0, _cardinals.en, {
        one: (0, _runtime.number)("en", d.limit, 0) + " error/hour",
        other: (0, _runtime.number)("en", d.limit, 0) + " errors/hour"
      }) + ".\n",
      "logs_error_rate_notice.exceeded_minute_MF": d => "<b>" + d.relativeAge + "</b> – <a href=\"" + d.url + "\" target=\"_blank\">" + (0, _runtime.plural)(d.rate, 0, _cardinals.en, {
        one: (0, _runtime.number)("en", d.rate, 0) + " error/minute",
        other: (0, _runtime.number)("en", d.rate, 0) + " errors/minute"
      }) + "</a> exceeded site setting limit of " + (0, _runtime.plural)(d.limit, 0, _cardinals.en, {
        one: (0, _runtime.number)("en", d.limit, 0) + " error/minute",
        other: (0, _runtime.number)("en", d.limit, 0) + " errors/minute"
      }) + ".\n",
      "summary.description_time_MF": d => "There " + (0, _runtime.plural)(d.replyCount, 0, _cardinals.en, {
        one: "is <b>" + (0, _runtime.number)("en", d.replyCount, 0) + "</b> reply",
        other: "are <b>" + (0, _runtime.number)("en", d.replyCount, 0) + "</b> replies"
      }) + " with an estimated read time of <b>" + (0, _runtime.plural)(d.readingTime, 0, _cardinals.en, {
        one: (0, _runtime.number)("en", d.readingTime, 0) + " minute",
        other: (0, _runtime.number)("en", d.readingTime, 0) + " minutes"
      }) + "</b>.\n",
      "topic.read_more_MF": d => (0, _runtime.select)(d.HAS_UNREAD_AND_NEW, {
        true: "\n    " + (0, _runtime.plural)(d.UNREAD, 0, _cardinals.en, {
          "0": "",
          one: "There is <a href=\"" + d.basePath + "/unread\">" + (0, _runtime.number)("en", d.UNREAD, 0) + " unread</a>",
          other: "There are <a href=\"" + d.basePath + "/unread\">" + (0, _runtime.number)("en", d.UNREAD, 0) + " unread</a>"
        }) + "\n    " + (0, _runtime.plural)(d.NEW, 0, _cardinals.en, {
          "0": "",
          one: " and <a href=\"" + d.basePath + "/new\">" + (0, _runtime.number)("en", d.NEW, 0) + " new</a> topic remaining,",
          other: " and <a href=\"" + d.basePath + "/new\">" + (0, _runtime.number)("en", d.NEW, 0) + " new</a> topics remaining,"
        }) + "\n  ",
        false: "\n    " + (0, _runtime.plural)(d.UNREAD, 0, _cardinals.en, {
          "0": "",
          one: "There is <a href=\"" + d.basePath + "/unread\">" + (0, _runtime.number)("en", d.UNREAD, 0) + " unread</a> topic remaining,",
          other: "There are <a href=\"" + d.basePath + "/unread\">" + (0, _runtime.number)("en", d.UNREAD, 0) + " unread</a> topics remaining,"
        }) + "\n    " + (0, _runtime.plural)(d.NEW, 0, _cardinals.en, {
          "0": "",
          one: "There is <a href=\"" + d.basePath + "/new\">" + (0, _runtime.number)("en", d.NEW, 0) + " new</a> topic remaining,",
          other: "There are <a href=\"" + d.basePath + "/new\">" + (0, _runtime.number)("en", d.NEW, 0) + " new</a> topics remaining,"
        }) + "\n  ",
        other: ""
      }) + "\n" + (0, _runtime.select)(d.HAS_CATEGORY, {
        true: " or browse other topics in " + d.categoryLink,
        false: " or <a href=\"" + d.basePath + "/latest\">view latest topics</a>",
        other: ""
      }) + "\n",
      "flagging.delete_confirm_MF": d => "You are about to delete " + (0, _runtime.plural)(d.POSTS, 0, _cardinals.en, {
        one: "<b>" + (0, _runtime.number)("en", d.POSTS, 0) + "</b> post",
        other: "<b>" + (0, _runtime.number)("en", d.POSTS, 0) + "</b> posts"
      }) + " and " + (0, _runtime.plural)(d.TOPICS, 0, _cardinals.en, {
        one: "<b>" + (0, _runtime.number)("en", d.TOPICS, 0) + "</b> topic",
        other: "<b>" + (0, _runtime.number)("en", d.TOPICS, 0) + "</b> topics"
      }) + " from this user, remove their account, block signups from their IP address <b>" + d.ip_address + "</b>, and add their email address <b>" + d.email + "</b> to a permanent block list. Are you sure this user is really a spammer?\n",
      posts_likes_MF: d => (0, _runtime.plural)(d.count, 0, _cardinals.en, {
        one: (0, _runtime.number)("en", d.count, 0) + " reply,",
        other: (0, _runtime.number)("en", d.count, 0) + " replies,"
      }) + (0, _runtime.select)(d.ratio, {
        low: " high like to post ratio,",
        med: " very high like to post ratio,",
        high: " extremely high like to post ratio,",
        other: ""
      }) + " jump to the first or last post…\n",
      "chat.mention_warning.groups.too_many_members_MF": d => (0, _runtime.plural)(d.groupCount, 0, _cardinals.en, {
        "1": "\n          " + (0, _runtime.select)(d.isAdmin, {
          true: "\n              " + (0, _runtime.plural)(d.notificationLimit, 0, _cardinals.en, {
            one: "Mentioning @" + d.group1 + " exceeds the <a href=\"" + d.siteSettingUrl + "\" target=\"_blank\">notification limit</a> of " + (0, _runtime.number)("en", d.notificationLimit, 0) + " user.",
            other: "Mentioning @" + d.group1 + " exceeds the <a href=\"" + d.siteSettingUrl + "\" target=\"_blank\">notification limit</a> of " + (0, _runtime.number)("en", d.notificationLimit, 0) + " users."
          }) + "\n            ",
          false: "\n              " + (0, _runtime.plural)(d.notificationLimit, 0, _cardinals.en, {
            one: "Mentioning @" + d.group1 + " exceeds the notification limit of " + (0, _runtime.number)("en", d.notificationLimit, 0) + " user.",
            other: "Mentioning @" + d.group1 + " exceeds the notification limit of " + (0, _runtime.number)("en", d.notificationLimit, 0) + " users."
          }) + "\n            ",
          other: ""
        }) + "\n        ",
        "2": "\n          " + (0, _runtime.select)(d.isAdmin, {
          true: "\n              " + (0, _runtime.plural)(d.notificationLimit, 0, _cardinals.en, {
            one: "Mentioning @" + d.group1 + " and @" + d.group2 + " exceeds the <a href=\"" + d.siteSettingUrl + "\" target=\"_blank\">notification limit</a> of " + (0, _runtime.number)("en", d.notificationLimit, 0) + " user.",
            other: "Mentioning @" + d.group1 + " and @" + d.group2 + " exceeds the <a href=\"" + d.siteSettingUrl + "\" target=\"_blank\">notification limit</a> of " + (0, _runtime.number)("en", d.notificationLimit, 0) + " users."
          }) + "\n            ",
          false: "\n              " + (0, _runtime.plural)(d.notificationLimit, 0, _cardinals.en, {
            one: "Mentioning @" + d.group1 + " and @" + d.group2 + " exceeds the notification limit of " + (0, _runtime.number)("en", d.notificationLimit, 0) + " user.",
            other: "Mentioning @" + d.group1 + " and @" + d.group2 + " exceeds the notification limit of " + (0, _runtime.number)("en", d.notificationLimit, 0) + " users."
          }) + "\n            ",
          other: ""
        }) + "\n        ",
        other: "\n          " + (0, _runtime.select)(d.isAdmin, {
          true: "\n              " + (0, _runtime.plural)(d.notificationLimit, 0, _cardinals.en, {
            one: "Mentioning these " + d.groupCount + " groups exceeds the <a href=\"" + d.siteSettingUrl + "\" target=\"_blank\">notification limit</a> of " + (0, _runtime.number)("en", d.notificationLimit, 0) + " user.",
            other: "Mentioning these " + d.groupCount + " groups exceeds the <a href=\"" + d.siteSettingUrl + "\" target=\"_blank\">notification limit</a> of " + (0, _runtime.number)("en", d.notificationLimit, 0) + " users."
          }) + "\n            ",
          false: "\n              " + (0, _runtime.plural)(d.notificationLimit, 0, _cardinals.en, {
            one: "Mentioning these " + d.groupCount + " groups exceeds the notification limit of " + (0, _runtime.number)("en", d.notificationLimit, 0) + " user.",
            other: "Mentioning these " + d.groupCount + " groups exceeds the notification limit of " + (0, _runtime.number)("en", d.notificationLimit, 0) + " users."
          }) + "\n            ",
          other: ""
        }) + "\n        "
      }) + "\n",
      "chat.create_channel.auto_join_users.warning_multiple_groups_MF": d => (0, _runtime.plural)(d.groupCount, 0, _cardinals.en, {
        one: "\n          " + (0, _runtime.plural)(d.userCount, 0, _cardinals.en, {
          one: "Automatically add " + d.userCount + " user from " + d.groupName + " and " + d.groupCount + " other group?",
          other: "Automatically add " + d.userCount + " users from " + d.groupName + " and " + d.groupCount + " other group?"
        }) + "\n        ",
        other: "\n          " + (0, _runtime.plural)(d.userCount, 0, _cardinals.en, {
          one: "Automatically add " + d.userCount + " user from " + d.groupName + " and " + d.groupCount + " other groups?",
          other: "Automatically add " + d.userCount + " users from " + d.groupName + " and " + d.groupCount + " other groups?"
        }) + "\n        "
      }) + "\n",
      "admin.user.penalty_history_MF": d => "In the past 6 months this user has been <b>suspended " + (0, _runtime.plural)(d.SUSPENDED, 0, _cardinals.en, {
        one: (0, _runtime.number)("en", d.SUSPENDED, 0) + " time",
        other: (0, _runtime.number)("en", d.SUSPENDED, 0) + " times"
      }) + "</b> and <b>silenced " + (0, _runtime.plural)(d.SILENCED, 0, _cardinals.en, {
        one: (0, _runtime.number)("en", d.SILENCED, 0) + " time",
        other: (0, _runtime.number)("en", d.SILENCED, 0) + " times"
      }) + "</b>.",
      "admin.user.delete_all_posts_confirm_MF": d => "You are about to delete " + (0, _runtime.plural)(d.POSTS, 0, _cardinals.en, {
        one: (0, _runtime.number)("en", d.POSTS, 0) + " post",
        other: (0, _runtime.number)("en", d.POSTS, 0) + " posts"
      }) + " and " + (0, _runtime.plural)(d.TOPICS, 0, _cardinals.en, {
        one: (0, _runtime.number)("en", d.TOPICS, 0) + " topic",
        other: (0, _runtime.number)("en", d.TOPICS, 0) + " topics"
      }) + ". Are you sure?\n"
    }
  };
  const messages = new _messages.default(msgData, "en");
  messages.defaultLocale = "en";
  globalThis.I18n._mfMessages = messages;
});
require("discourse-mf");
