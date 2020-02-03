# send-to-qiita README

This is an extension for posting articles to qiita.com.

## Features

### Regist token

1. Inkey `Ctrl+P`
2. Input `>Regist Qiita token`
3. Input Qiita writeable token.

### Send article

1. Register the token in advance.
2. Input header and article. The header must have a title and tags.

    ```plain
    ---
    title: article title
    tags: Unsplit_string1:0.0.1 Unsplit_string2
    tweet: false
    private: false
    coediting: false
    group_url_name: dev
    ---
    # article
    contents...
    ```

3. Inkey `Ctrl+P`
4. Input `>Send to Qiita`

## Extension Settings

* `send-to-qiita.token`: Qiita writable token.

## Known Issues

1. When registering a token, json formatting is broken.
2. Posting will fail if there is no tag.

## Release Notes

### 1.0.0

Initial release of send-to-qiita extentions.
