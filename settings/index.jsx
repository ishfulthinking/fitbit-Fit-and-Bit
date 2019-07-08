function mySettings(props) {
  return (
    <Page>
      <Section
        title={<Text bold align="center">Background Color</Text>}>
        <ColorSelect
          settingsKey="color"
          colors={[
            {color: "#ABB5AD"}, // dull green
            {color: "#E9EAE4"}, // light gray
            {color: "#E4D19E"}, // light yellow
            {color: "#B9E5FE"}, // light blue
            {color: "#DD9696"}, // light red
            {color: "#B5AECD"}  // light purple
          ]}
        />
      </Section>
    </Page>
  );
}

registerSettingsPage(mySettings);
