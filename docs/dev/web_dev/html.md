# HTML Outlook

## Image Rendering Problem in HTML

Initially, there is problem in a page with say `3x3` image dashboard, but that as image size become not standard, the original code make the guys look fat and swollen:  

```html
<td style="border-right:none;">
    <img src="example.com" width="200" height="229" style="display: inline"></img>
    <br><br>
</td>
```

Next, it is resolved by not restricting the width, so that it is not resized:  

```html
<td style="border-right:none;">
    <img src="example.com"  style="display: inline; height: 229px; width: auto; max-height: 100%;"></img>
    <br><br>
</td>
```

But then after viewing a bit again, some more problem if say more than 1 shorter images appear on a row,  

```html
<td style="border-right:none;">
    <div style="width: 200px; height: 229px; overflow: hidden; display: inline-block;">
        <img src="example.com" 
             style="display: block; width: 100%; height: 100%; object-fit: cover; object-position: center;">
    </div>
    <br><br>
</td>
```
