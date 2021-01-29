import React, { useRef } from 'react'

import { StyleSheet, View, Text, ScrollView } from 'react-native'
import ImagePickerBottomSheet from './ImagePickerBottomSheet'

const ImageInputList = ({ imageUris = [], onRemoveImage, onAddImage, abx }) => {
  const scrollRef = useRef(null)

  return (
    <ScrollView
      ref={scrollRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      onContentSizeChange={() => {
        if (scrollRef.current) scrollRef.current.scrollToEnd()
      }}
    >
      <View style={styles.container}>
        {imageUris.map((uri, i) => (
          <View key={`${uri}-${i}`} style={styles.image}>
            <ImagePickerBottomSheet
              imageUri={uri}
              onChangeImage={() => onRemoveImage(uri)}
              imageList
            />
          </View>
        ))}

        <ImagePickerBottomSheet onChangeImage={(uri) => onAddImage(uri)} />
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  image: {
    marginRight: 10,
  },
})

export default ImageInputList
