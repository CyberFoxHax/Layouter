# Layouter
WPF like layout engine for HTML to avoid having to deal with layout within CSS.

```XML
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
    <title>Layouter example</title>
    <style>* {margin:0; padding: 0; font-family: Arial; position: absolute;}</style>

    <script src="layouter.js"></script>
</head>
<body>
  
	<div Stack="Vertical" MarginTop="50" MarginLeft="10">
		<div VerticalAlignment="Top" Height="100" MarginBottom="10" style="background: #f3f3f3;" Template="Event">
			<div HorizontalAlignment="Left" MarginRight="150" Padding="10">
				<div VerticalAlignment="Top" Height="20">
					{{title1}}
				</div>
				<div VerticalAlignment="Top" Height="20" MarginTop="40" MarginLeft="20" style="color:#666" >
					{{date}}
				</div>
			</div>
			<div Stack="Horizontal" HorizontalAlignment="Right" Width="150">
				<div HorizontalAlignment="Right" Width="50"><p class="button-center-text list-item-button">Delete</p></div>
				<div HorizontalAlignment="Right" Width="50"><p class="button-center-text list-item-button">Hide</p></div>
				<div HorizontalAlignment="Right" Width="50"><p class="button-center-text list-item-button">Edit</p></div>
			</div>
		</div>
	</div>

</body>
</html>
```
